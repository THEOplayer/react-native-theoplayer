package com.theoplayer.audio

import com.facebook.react.bridge.ReadableMap

object BackgroundAudioConfigAdapter {
  private const val PROP_ENABLED = "enabled"
  private const val PROP_STOP_ON_BACKGROUND = "stopOnBackground"

  private const val DEFAULT_ENABLED = false
  private const val DEFAULT_STOP_ON_BACKGROUND = false

  fun fromProps(props: ReadableMap?): BackgroundAudioConfig {
    val enabled = props?.hasKey(PROP_ENABLED)?.let {
      props.getBoolean(PROP_ENABLED)
    } ?: DEFAULT_ENABLED
    val destroy = props?.hasKey(PROP_STOP_ON_BACKGROUND)?.let {
      props.getBoolean(PROP_STOP_ON_BACKGROUND)
    } ?: DEFAULT_STOP_ON_BACKGROUND
    return BackgroundAudioConfig(
      enabled = enabled,
      stopOnBackground = destroy
    )
  }
}
