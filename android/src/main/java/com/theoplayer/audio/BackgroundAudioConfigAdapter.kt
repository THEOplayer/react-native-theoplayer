package com.theoplayer.audio

import com.facebook.react.bridge.ReadableMap

object BackgroundAudioConfigAdapter {
  private const val PROP_ENABLED = "enabled"
  private const val PROP_STOP_ON_BACKGROUND = "stopOnBackground"

  private const val DEFAULT_ENABLED = false
  private const val DEFAULT_STOP_ON_BACKGROUND = false

  fun fromProps(props: ReadableMap?): BackgroundAudioConfig {
    return BackgroundAudioConfig(
      enabled = if (props?.hasKey(PROP_ENABLED) == true)
        props.getBoolean(PROP_ENABLED) else DEFAULT_ENABLED,
      stopOnBackground = if (props?.hasKey(PROP_STOP_ON_BACKGROUND) == true)
        props.getBoolean(PROP_STOP_ON_BACKGROUND) else DEFAULT_STOP_ON_BACKGROUND
    )
  }
}
