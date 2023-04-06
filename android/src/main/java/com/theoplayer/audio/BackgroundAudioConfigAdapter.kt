package com.theoplayer.audio

import com.facebook.react.bridge.ReadableMap

object BackgroundAudioConfigAdapter {
  private const val PROP_ENABLED = "enabled"

  private const val DEFAULT_ENABLED = false

  fun fromProps(props: ReadableMap?): BackgroundAudioConfig {
    val enabled =
      if (props?.hasKey(PROP_ENABLED) == true) props.getBoolean(PROP_ENABLED) else DEFAULT_ENABLED
    return BackgroundAudioConfig(enabled)
  }
}
