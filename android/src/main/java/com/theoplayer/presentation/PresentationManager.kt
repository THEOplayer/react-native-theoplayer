package com.theoplayer.presentation

import android.annotation.SuppressLint
import android.app.AppOpsManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.ViewGroup
import android.view.ViewParent
import androidx.activity.ComponentActivity
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.core.view.children
import androidx.lifecycle.Lifecycle
import com.facebook.react.ReactRootView
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.views.view.ReactViewGroup
import com.theoplayer.BuildConfig
import com.theoplayer.PlayerEventEmitter
import com.theoplayer.ReactTHEOplayerContext
import com.theoplayer.android.api.error.ErrorCode
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.player.PresentationMode

private const val FULLSCREEN_EVENT_DELAY: Long = 150

@SuppressLint("UnspecifiedRegisterReceiverFlag")
class PresentationManager(
  private val viewCtx: ReactTHEOplayerContext,
  private val reactContext: ThemedReactContext,
  private val eventEmitter: PlayerEventEmitter,
) {
  private var supportsPip = false
  private var onUserLeaveHintReceiver: BroadcastReceiver? = null
  private var onPictureInPictureModeChanged: BroadcastReceiver? = null
  private val pipUtils: PipUtils = PipUtils(viewCtx, reactContext)
  private val fullScreenLayoutObserver = FullScreenLayoutObserver()
  private val playerGroupRestoreOptions by lazy {
    PlayerGroupRestoreOptions()
  }

  var currentPresentationMode: PresentationMode = PresentationMode.INLINE
    private set
  var currentPresentationModeChangeContext: PresentationModeChangeContext? = null
    private set

  var pipConfig: PipConfig = PipConfig()

  init {
    onUserLeaveHintReceiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context?, intent: Intent?) {
        // Optionally into PiP mode when the app goes to background.
        if (pipConfig.startsAutomatically == true) {
          setPresentation(PresentationMode.PICTURE_IN_PICTURE)
        }
      }
    }
    onPictureInPictureModeChanged = object : BroadcastReceiver() {
      override fun onReceive(context: Context?, intent: Intent?) {
        val transitioningToPip = intent
          ?.getBooleanExtra("isTransitioningToPip", false) ?: false
        val inPip = intent?.getBooleanExtra("isInPictureInPictureMode", false) ?: false
        // Dispatch event on every PiP mode change
        when {
          transitioningToPip -> onEnterPip(true)
          inPip -> onEnterPip()
          else -> onExitPip()
        }
      }
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      supportsPip =
        reactContext.packageManager.hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE)
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      reactContext.currentActivity?.registerReceiver(
        onUserLeaveHintReceiver, IntentFilter("onUserLeaveHint"), Context.RECEIVER_EXPORTED
      )
    } else {
      reactContext.currentActivity?.registerReceiver(
        onUserLeaveHintReceiver, IntentFilter("onUserLeaveHint")
      )
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      reactContext.currentActivity?.registerReceiver(
        onPictureInPictureModeChanged, IntentFilter("onPictureInPictureModeChanged"),
        Context.RECEIVER_EXPORTED
      )
    } else {
      reactContext.currentActivity?.registerReceiver(
        onPictureInPictureModeChanged, IntentFilter("onPictureInPictureModeChanged")
      )
    }
  }

  fun destroy() {
    try {
      reactContext.currentActivity?.unregisterReceiver(onUserLeaveHintReceiver)
      reactContext.currentActivity?.unregisterReceiver(onPictureInPictureModeChanged)
      fullScreenLayoutObserver.remove()
      pipUtils.destroy()
    } catch (ignore: Exception) {
    }
  }

  fun setPresentation(mode: PresentationMode) {
    when (mode) {
      PresentationMode.INLINE -> {
        setFullscreen(false)
      }

      PresentationMode.FULLSCREEN -> {
        setFullscreen(true)
      }

      PresentationMode.PICTURE_IN_PICTURE -> {
        setFullscreen(false)
        enterPip()
      }
    }
  }

  private fun enterPip() {
    // PiP not supported
    if (!supportsPip || Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    // Already in right PiP state?
    if (currentPresentationMode == PresentationMode.PICTURE_IN_PICTURE) {
      return
    }

    // Check to see whether this activity is in the process of finishing, either because you
    // called finish on it or someone else has requested that it finished.
    if (reactContext.currentActivity?.isFinishing == true) {
      return
    }

    // Check whether the special permission Picture-in-Picture is given.
    if (!hasPipPermission()) {
      return
    }

    try {
      pipUtils.enable()
      reactContext.currentActivity?.enterPictureInPictureMode(pipUtils.getPipParams())
      if (BuildConfig.REPARENT_ON_PIP) {
        reparentPlayerToRoot()
      }
    } catch (_: Exception) {
      onPipError()
    }
  }

  private fun onEnterPip(transitioningToPip: Boolean = false) {
    updatePresentationMode(
      PresentationMode.PICTURE_IN_PICTURE,
      if (transitioningToPip)
        PresentationModeChangeContext(PresentationModeChangePipContext.TRANSITIONING_TO_PIP)
      else null
    )
  }

  private fun onExitPip() {
    val pipCtx: PresentationModeChangePipContext =
      if ((reactContext.currentActivity as? ComponentActivity)
          ?.lifecycle?.currentState == Lifecycle.State.CREATED
      ) {
        PresentationModeChangePipContext.CLOSED
      } else {
        PresentationModeChangePipContext.RESTORED
      }
    if (BuildConfig.REPARENT_ON_PIP) {
      reparentPlayerToOriginal()
    }
    updatePresentationMode(PresentationMode.INLINE, PresentationModeChangeContext(pipCtx))
    pipUtils.disable()
  }

  private fun hasPipPermission(): Boolean {
    val appOps = reactContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager?
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        appOps?.unsafeCheckOpNoThrow(
          AppOpsManager.OPSTR_PICTURE_IN_PICTURE,
          reactContext.applicationInfo.uid,
          reactContext.packageName
        ) == AppOpsManager.MODE_ALLOWED
      } else {
        @Suppress("DEPRECATION")
        appOps?.checkOpNoThrow(
          AppOpsManager.OPSTR_PICTURE_IN_PICTURE,
          reactContext.applicationInfo.uid,
          reactContext.packageName
        ) == AppOpsManager.MODE_ALLOWED
      }
    } else {
      false
    }
  }

  private fun onPipError() {
    val message = "Failed to enter picture-in-picture mode."
    eventEmitter.emitError(THEOplayerException(ErrorCode.CONFIGURATION_ERROR, message))
  }

  private fun setFullscreen(fullscreen: Boolean) {
    if ((fullscreen && currentPresentationMode == PresentationMode.FULLSCREEN) ||
      (!fullscreen && currentPresentationMode == PresentationMode.INLINE)
    ) {
      return
    }
    val activity = reactContext.currentActivity ?: return
    val window = activity.window

    if (fullscreen) {
      // Hide system bars for immersive mode.
      // {@link https://developer.android.com/develop/ui/views/layout/immersive}
      WindowInsetsControllerCompat(window, window.decorView).apply {
        // Reveal hidden system bars on any system gestures.
        systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        // Hide all system bars.
        hide(WindowInsetsCompat.Type.systemBars())
      }

      // Delay the event making sure it does not arrive before animations ended.
      Handler(Looper.getMainLooper()).postDelayed({
        updatePresentationMode(PresentationMode.FULLSCREEN)
      }, FULLSCREEN_EVENT_DELAY)

      if (BuildConfig.REPARENT_ON_FULLSCREEN) {
        reparentPlayerToRoot()
      }
    } else {
      WindowInsetsControllerCompat(window, window.decorView).show(
        WindowInsetsCompat.Type.systemBars()
      )
      updatePresentationMode(PresentationMode.INLINE)

      if (BuildConfig.REPARENT_ON_FULLSCREEN) {
        reparentPlayerToOriginal()
      }
    }
  }

  // region Re-parent playerViewGroup logic
  private val reactPlayerGroup: ReactViewGroup?
    get() = viewCtx.playerView.getClosestParentOfType()

  private val rootView: ReactRootView?
    get() {
      val activity = reactContext.currentActivity ?: return null
      // Try to search in parents and as a fallback option from root to bottom using depth-first order
      return reactPlayerGroup?.getClosestParentOfType()
        ?: (activity.window.decorView.rootView as? ViewGroup)
          ?.getClosestParentOfType(false)
    }

  private fun reparentPlayerToRoot() {
    reactPlayerGroup?.let { playerGroup ->
      playerGroupRestoreOptions.parentNode = (playerGroup.parent as? ViewGroup)?.also { parent ->
        playerGroupRestoreOptions.childIndex = parent.indexOfChild(playerGroup)

        // Re-parent the playerViewGroup to the root node
        parent.removeView(playerGroup)
        rootView?.addView(playerGroup)

        // Attach an observer that overrides the react-native lay-out and forces fullscreen.
        fullScreenLayoutObserver.attach(playerGroup)
      }
    }
  }

  private fun reparentPlayerToOriginal() {
    rootView?.run {
      reactPlayerGroup?.let { playerGroup ->
        // Remove forced layout observer
        fullScreenLayoutObserver.remove()

        // Re-parent the playerViewGroup from the root node to its original parent
        removeView(playerGroup)
        playerGroupRestoreOptions.parentNode?.addView(playerGroup, playerGroupRestoreOptions.childIndex ?: 0)
        playerGroupRestoreOptions.reset()
      }
    }
  }
// endregion

  private fun updatePresentationMode(
    presentationMode: PresentationMode,
    context: PresentationModeChangeContext? = null
  ) {
    if (presentationMode == currentPresentationMode &&
      context == currentPresentationModeChangeContext
    ) {
      return
    }
    val prevPresentationMode = currentPresentationMode
    currentPresentationMode = presentationMode
    currentPresentationModeChangeContext = context
    eventEmitter.emitPresentationModeChange(presentationMode, prevPresentationMode, context)

    // Resume playing when going to PiP and player was playing
    if (presentationMode == PresentationMode.PICTURE_IN_PICTURE && viewCtx.wasPlayingOnHostPause) {
      viewCtx.player.play()
    }

    // Apply background audio config when closing PiP window
    if (context?.pip == PresentationModeChangePipContext.CLOSED && !viewCtx.backgroundAudioConfig.enabled) {
      viewCtx.player.pause()
    }
  }
}

inline fun <reified T : View> ViewGroup.getClosestParentOfType(upward: Boolean = true): T? {
  if (upward) {
    // Search in the parent views of `this` view up to the root
    var parent: ViewParent? = parent
    while (parent != null && parent !is T) {
      parent = parent.parent
    }
    return parent as? T
  } else {
    // Search in the children collection.
    val viewStack = ArrayDeque(children.toList())
    // Use Stack/LIFO instead of recursion
    while (viewStack.isNotEmpty()) {
      when (val view = viewStack.removeAt(0)) {
        is T -> {
          return view
        }

        is ViewGroup -> {
          // Filling LIFO with all children of the ViewGroup: depth-first order
          viewStack.addAll(0, view.children.toList())
        }
      }
    }
    // Found nothing
    return null
  }
}

private class PlayerGroupRestoreOptions {
  var childIndex: Int? = null
  var parentNode: ViewGroup? = null

  fun reset() {
    parentNode = null
    childIndex = null
  }
}
