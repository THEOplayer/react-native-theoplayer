package com.theoplayer.presentation

import android.annotation.SuppressLint
import android.app.AppOpsManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Build
import android.view.View
import android.view.ViewGroup
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
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.error.ErrorCode
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.player.PresentationMode
import com.theoplayer.util.findReactRootView
import com.theoplayer.util.getClosestParentOfType

const val IS_TRANSITION_INTO_PIP = "isTransitioningToPip"
const val IS_IN_PIP_MODE = "isInPictureInPictureMode"
const val ON_USER_LEAVE_HINT = "onUserLeaveHint"
const val ON_PIP_MODE_CHANGED = "onPictureInPictureModeChanged"

@Suppress("KotlinConstantConditions", "SimplifyBooleanWithConstants")
@SuppressLint("UnspecifiedRegisterReceiverFlag")
class PresentationManager(
  private val viewCtx: ReactTHEOplayerContext,
  private val reactContext: ThemedReactContext,
  private val eventEmitter: PlayerEventEmitter,
) {
  private var supportsPip = false
  private var onUserLeaveHintReceiver: BroadcastReceiver? = null
  private var onUserLeaveHintRunnable: Runnable = Runnable {
    if (pipConfig.startsAutomatically == true) {
      setPresentation(PresentationMode.PICTURE_IN_PICTURE)
    }
  }
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
    onPictureInPictureModeChanged = object : BroadcastReceiver() {
      override fun onReceive(context: Context?, intent: Intent?) {
        val transitioningToPip = intent?.getBooleanExtra(IS_TRANSITION_INTO_PIP, false) ?: false
        val inPip = intent?.getBooleanExtra(IS_IN_PIP_MODE, false) ?: false
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

    reactContext.currentActivity?.let { activity ->
      // On Android 16+, the broadcasted onUserLeaveHint comes too late to activate PiP presentation
      // mode, and the activity will not go into PiP when the user backgrounds the app. In this case
      // we rely on the newer addOnUserLeaveHintListener and ignore the broadcast event.
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.VANILLA_ICE_CREAM) {
        onUserLeaveHintReceiver = object : BroadcastReceiver() {
          override fun onReceive(context: Context?, intent: Intent?) {
            onUserLeaveHintRunnable.run()
          }
        }
      } else {
        (activity as? ComponentActivity)?.addOnUserLeaveHintListener(onUserLeaveHintRunnable)
      }

      @SuppressLint("UnspecifiedRegisterReceiverFlag")
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        activity.registerReceiver(
          onUserLeaveHintReceiver,
          IntentFilter(ON_USER_LEAVE_HINT),
          Context.RECEIVER_EXPORTED
        )
        activity.registerReceiver(
          onPictureInPictureModeChanged,
          IntentFilter(ON_PIP_MODE_CHANGED),
          Context.RECEIVER_EXPORTED
        )
      } else {
        activity.registerReceiver(onUserLeaveHintReceiver, IntentFilter(ON_USER_LEAVE_HINT))
        activity.registerReceiver(onPictureInPictureModeChanged, IntentFilter(ON_PIP_MODE_CHANGED))
      }
    }
  }

  fun destroy() {
    try {
      reactContext.currentActivity?.let { activity ->
        onUserLeaveHintReceiver?.let { activity.unregisterReceiver(it) }
        (activity as? ComponentActivity)?.removeOnUserLeaveHintListener(onUserLeaveHintRunnable)
        onPictureInPictureModeChanged?.let { activity.unregisterReceiver(it) }
      }

      fullScreenLayoutObserver.remove()
      pipUtils.destroy()
    } catch (_: Exception) {
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
    if (!supportsPip || Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

    // Already in right PiP state?
    if (currentPresentationMode == PresentationMode.PICTURE_IN_PICTURE) return

    // Check to see whether this activity is in the process of finishing, either because you
    // called finish on it or someone else has requested that it finished.
    if (reactContext.currentActivity?.isFinishing == true) return

    // Check whether the special permission Picture-in-Picture is given.
    if (!hasPipPermission()) return

    try {
      pipUtils.enable()
      reactContext.currentActivity?.enterPictureInPictureMode(pipUtils.getPipParams())
    } catch (_: Exception) {
      onPipError()
    }
  }

  private fun setPlayerSiblingsVisibility(visible: Boolean) = reactPlayerGroup?.children?.forEach {
    if (it !is ReactTHEOplayerView) {
      it.visibility = if (visible) View.VISIBLE else View.INVISIBLE
    }
  }

  /**
   * Called when the transition into PiP either starts (transitioningToPip = true)
   * or after it ends (transitioningToPip = false)
   */
  private fun onEnterPip(transitioningToPip: Boolean = false) {
    setPlayerSiblingsVisibility(false)
    if (BuildConfig.REPARENT_ON_PIP && !transitioningToPip && pipConfig.reparentPip == true) {
      reparentPlayerToRoot()
    }

    updatePresentationMode(
      PresentationMode.PICTURE_IN_PICTURE,
      if (transitioningToPip) PresentationModeChangeContext(PresentationModeChangePipContext.TRANSITIONING_TO_PIP)
      else null
    )
  }

  /**
   * Called when the PiP exit transition starts.
   */
  private fun onExitPip() {
    setPlayerSiblingsVisibility(true)
    val pipCtx: PresentationModeChangePipContext =
      if ((reactContext.currentActivity as? ComponentActivity)?.lifecycle?.currentState == Lifecycle.State.CREATED) {
        PresentationModeChangePipContext.CLOSED
      } else {
        PresentationModeChangePipContext.RESTORED
      }
    if (BuildConfig.REPARENT_ON_PIP && pipConfig.reparentPip == true) {
      reparentPlayerToOriginal()
    }
    updatePresentationMode(PresentationMode.INLINE, PresentationModeChangeContext(pipCtx))
    pipUtils.disable()
  }

  @Suppress("DEPRECATION")
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
    if ((fullscreen && currentPresentationMode == PresentationMode.FULLSCREEN) || (!fullscreen && currentPresentationMode == PresentationMode.INLINE)) {
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

      updatePresentationMode(PresentationMode.FULLSCREEN)

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
    get() = findReactRootView( reactContext, reactPlayerGroup)

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
        playerGroupRestoreOptions.parentNode?.addView(
          playerGroup, playerGroupRestoreOptions.childIndex ?: 0
        )
        playerGroupRestoreOptions.reset()
      }
    }
  }
// endregion

  private fun updatePresentationMode(
    presentationMode: PresentationMode, context: PresentationModeChangeContext? = null
  ) {
    if (presentationMode == currentPresentationMode && context == currentPresentationModeChangeContext) {
      return
    }
    val prevPresentationMode = currentPresentationMode
    currentPresentationMode = presentationMode
    currentPresentationModeChangeContext = context
    eventEmitter.emitPresentationModeChange(presentationMode, prevPresentationMode, context)

    // Resume play-out when going to PiP and player was playing
    if (presentationMode == PresentationMode.PICTURE_IN_PICTURE && viewCtx.wasPlayingOnHostPause) {
      viewCtx.player.play()
    }

    // When closing PiP window
    if (context?.pip == PresentationModeChangePipContext.CLOSED) {
      // Pause if background audio is not enabled
      if (!viewCtx.backgroundAudioConfig.enabled) viewCtx.player.pause()

      // Optionally fully stop play-out
      if (viewCtx.backgroundAudioConfig.stopOnBackground) viewCtx.player.stop()
    }
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
