package com.theoplayer.playback

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.settings.PlaybackSettings

class PlaybackSettingsModule(private val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val playbackSettings: PlaybackSettings
    get() = THEOplayerGlobal.getSharedInstance(context.applicationContext).playbackSettings

  override fun getName(): String {
    return "THEORCTPlaybackSettingsModule"
  }

  @ReactMethod
  fun useFastStartup(useFastStartup: Boolean) {
    playbackSettings.useFastStartup(useFastStartup)
  }

  @ReactMethod
  fun setLipSyncCorrection(correctionMs: Double) {
    playbackSettings.setLipSyncCorrection(correctionMs.toLong())
  }
}
