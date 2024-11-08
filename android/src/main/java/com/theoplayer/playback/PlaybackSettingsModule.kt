package com.theoplayer.playback

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.module.annotations.ReactModule
import com.theoplayer.specs.PlaybackSettingsModuleSpec
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.settings.PlaybackSettings

@ReactModule(name = PlaybackSettingsModule.NAME)
class PlaybackSettingsModule(private val context: ReactApplicationContext) :
  PlaybackSettingsModuleSpec(context) {

  companion object {
    const val NAME = "THEORCTPlaybackSettingsModule"
  }

  private val playbackSettings: PlaybackSettings
    get() = THEOplayerGlobal.getSharedInstance(context.applicationContext).playbackSettings

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun useFastStartup(useFastStartup: Boolean) {
    playbackSettings.useFastStartup(useFastStartup)
  }

  @ReactMethod
  override fun setLipSyncCorrection(correctionMs: Double) {
    playbackSettings.setLipSyncCorrection(correctionMs.toLong())
  }
}
