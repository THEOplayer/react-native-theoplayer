package com.theoplayer.presentation

import android.app.AppOpsManager
import android.app.PictureInPictureParams
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.graphics.Rect
import android.os.Build
import android.util.Rational
import android.view.SurfaceView
import android.view.TextureView
import android.view.View
import android.view.ViewGroup
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.uimanager.ThemedReactContext
import com.theoplayer.PlayerEventEmitter
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.android.api.error.ErrorCode
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.player.PresentationMode

private val PIP_ASPECT_RATIO_DEFAULT = Rational(16, 9)
private val PIP_ASPECT_RATIO_MIN = Rational(100, 239)
private val PIP_ASPECT_RATIO_MAX = Rational(239, 100)

class PresentationManager(
  private val view: THEOplayerView,
  private val reactContext: ThemedReactContext,
  private val eventEmitter: PlayerEventEmitter,
) {
  private var fullscreen = false
  private var canDoPip = false
  private var pip = false
  private var onUserLeaveHintReceiver: BroadcastReceiver? = null
  private var onPictureInPictureModeChanged: BroadcastReceiver? = null

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
        // Dispatch event on every PiP mode change
        pip = intent?.getBooleanExtra("isInPictureInPictureMode", false) ?: false
        eventEmitter.emitPresentationModeChange(if (pip) PresentationMode.PICTURE_IN_PICTURE else PresentationMode.INLINE)
      }
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      canDoPip =
        reactContext.packageManager.hasSystemFeature(PackageManager.FEATURE_PICTURE_IN_PICTURE)
    }
    reactContext.currentActivity?.registerReceiver(
      onUserLeaveHintReceiver, IntentFilter("onUserLeaveHint")
    )
    reactContext.currentActivity?.registerReceiver(
      onPictureInPictureModeChanged, IntentFilter("onPictureInPictureModeChanged")
    )
  }

  /**
   * Whether playback should be allowed to continue when the activity is paused.
   *
   * Pause if:
   * - No PiP available: Build.VERSION.SDK_INT < Build.VERSION_CODES.N (API 24), or;
   * - Not in PiP mode, and;
   * - Not configured to automatically go into PiP when going to the background.
   */
  val shouldPauseOnHostPause: Boolean
    get() = Build.VERSION.SDK_INT < Build.VERSION_CODES.N ||
      (reactContext.currentActivity?.isInPictureInPictureMode != true && pipConfig.startsAutomatically != true)

  fun onDestroy() {
    try {
      reactContext.currentActivity?.unregisterReceiver(onUserLeaveHintReceiver)
      reactContext.currentActivity?.unregisterReceiver(onPictureInPictureModeChanged)
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

  private fun getContentViewRect(view: ViewGroup): Rect? {
    for (i in 0 until view.childCount) {
      val child: View = view.getChildAt(i)
      if (child is ViewGroup) {
        return getContentViewRect(child)
      } else if (child as? SurfaceView != null || child as? TextureView != null) {
        val visibleRect = Rect()
        child.getGlobalVisibleRect(visibleRect)
        return visibleRect
      }
    }
    return null
  }

  private fun enterPip() {
    // PiP not supported
    if (!canDoPip || Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    // Already in right PiP state?
    if (pip) {
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

    val visibleRect = getContentViewRect(view)
    try {
      reactContext.currentActivity?.enterPictureInPictureMode(
        PictureInPictureParams.Builder().setSourceRectHint(visibleRect)
          // Must be between 2.39:1 and 1:2.39 (inclusive)
          .setAspectRatio(getSafeAspectRatio(view.player.videoWidth, view.player.videoHeight))
          // The active MediaSession will connect the controls
          .build()
      )
    } catch (_: Exception) {
      onPipError()
    }
  }

  private fun getSafeAspectRatio(width: Int, height: Int): Rational {
    val aspectRatio = Rational(width, height)
    if (aspectRatio.isNaN || aspectRatio.isInfinite || aspectRatio.isZero) {
      // Default aspect ratio
      return PIP_ASPECT_RATIO_DEFAULT
    }
    if (aspectRatio > PIP_ASPECT_RATIO_MAX) {
      return PIP_ASPECT_RATIO_MAX
    }
    if (aspectRatio < PIP_ASPECT_RATIO_MIN) {
      return PIP_ASPECT_RATIO_MIN
    }
    return aspectRatio
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
    if (fullscreen == this.fullscreen) {
      // Already in right fullscreen state
      return
    }
    this.fullscreen = fullscreen
    val activity = reactContext.currentActivity ?: return
    val window = activity.window
    if (fullscreen) {
      WindowInsetsControllerCompat(window, window.decorView).apply {
        systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
      }.hide(WindowInsetsCompat.Type.systemBars())
      eventEmitter.emitPresentationModeChange(PresentationMode.FULLSCREEN)
    } else {
      WindowInsetsControllerCompat(window, window.decorView).show(
        WindowInsetsCompat.Type.systemBars()
      )
      eventEmitter.emitPresentationModeChange(PresentationMode.INLINE)
    }
  }
}
