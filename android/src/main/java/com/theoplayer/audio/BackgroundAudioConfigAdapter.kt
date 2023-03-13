package com.theoplayer.audio

import com.facebook.react.bridge.ReadableMap

object BackgroundAudioConfigAdapter {
  private const val PROP_ENABLED = "enabled"

  fun fromProps(props: ReadableMap?): BackgroundAudioConfig {
    return BackgroundAudioConfig(props?.getBoolean(PROP_ENABLED) == true)
  }
}
