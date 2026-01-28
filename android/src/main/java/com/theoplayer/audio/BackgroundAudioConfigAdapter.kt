package com.theoplayer.audio

import com.facebook.react.bridge.ReadableMap
import com.theoplayer.util.getBooleanOrNull

object BackgroundAudioConfigAdapter {
  private const val PROP_ENABLED = "enabled"
  private const val PROP_STOP_ON_BACKGROUND = "stopOnBackground"

  private const val DEFAULT_ENABLED = false
  private const val DEFAULT_STOP_ON_BACKGROUND = false

  fun fromProps(props: ReadableMap?): BackgroundAudioConfig {
    return BackgroundAudioConfig(
      enabled = props?.getBooleanOrNull(PROP_ENABLED) ?: DEFAULT_ENABLED,
      stopOnBackground = props?.getBooleanOrNull(PROP_STOP_ON_BACKGROUND)
        ?: DEFAULT_STOP_ON_BACKGROUND,
    )
  }
}
