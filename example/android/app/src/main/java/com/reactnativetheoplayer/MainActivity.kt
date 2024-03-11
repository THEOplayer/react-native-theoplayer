package com.reactnativetheoplayer

import android.content.Intent
import android.content.res.Configuration
import android.media.AudioManager
import android.os.Build
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.google.android.gms.cast.framework.CastContext

open class MainActivity : ReactActivity() {
  public override fun onCreate(bundle: Bundle?) {
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
    return "ReactNativeTHEOplayer"
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  public override fun onUserLeaveHint() {
    this.sendBroadcast(Intent("onUserLeaveHint"))
    super.onUserLeaveHint()
  }

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
}
