package com.reactnativetheoplayer

import android.app.PictureInPictureUiState
import android.content.Intent
import android.content.res.Configuration
import android.media.AudioManager
import android.os.Build
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.google.android.gms.cast.framework.CastContext

open class MainActivity : ReactActivity() {
  public override fun onCreate(bundle: Bundle?) {
    // Edge-to-edge is enforced on Android 15 so that the system bars are transparent or
    // translucent by default. On earlier versions of Android, remove opaque system bars opaque by
    // calling enableEdgeToEdge().
    // On Android 15 and later devices, or after calling enableEdgeToEdge(), gesture navigation is
    // transparent by default. Three-button navigation is translucent by default or opaque if it is
    // inside the taskbar on large screen device.
    // (@link https://developer.android.com/design/ui/mobile/guides/foundations/system-bars#immersive-mode}
    enableEdgeToEdge()
    super.onCreate(bundle)

    // STREAM_MUSIC volume should be changed by the hardware volume controls.
    volumeControlStream = AudioManager.STREAM_MUSIC
    try {
      // lazy load Google Cast context
      CastContext.getSharedInstance(this)
    } catch (e: Exception) {
      // cast framework not supported
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String {
    return "ReactNativeTHEOplayerE2E"
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Called as part of the activity lifecycle when an activity is about to go into the background
   * as the result of user choice.
   */
  public override fun onUserLeaveHint() {
    this.sendBroadcast(Intent("onUserLeaveHint"))
    super.onUserLeaveHint()
  }

  /**
   * Called by the system when the activity changes to and from picture-in-picture mode.
   */
  override fun onPictureInPictureModeChanged(
    isInPictureInPictureMode: Boolean,
    newConfig: Configuration
  ) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig)
    }
    val intent = Intent("onPictureInPictureModeChanged")
    intent.putExtra("isInPictureInPictureMode", isInPictureInPictureMode)
    this.sendBroadcast(intent)
  }

  /**
   * Called by the system when the activity is in PiP and has state changes. Compare to
   * onPictureInPictureModeChanged, which is only called when PiP mode changes (meaning, enters
   * or exits PiP), this can be called at any time while the activity is in PiP mode.
   */
  override fun onPictureInPictureUiStateChanged(pipState: PictureInPictureUiState) {
    super.onPictureInPictureUiStateChanged(pipState)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM &&
      pipState.isTransitioningToPip
    ) {
      Intent("onPictureInPictureModeChanged").also {
        it.putExtra("isTransitioningToPip", true)
        sendBroadcast(it)
      }
    }
  }
}
