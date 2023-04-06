package com.theoplayer.audio

import com.facebook.react.bridge.ReadableMap

object BackgroundAudioConfigAdapter {
  private const val PROP_ENABLED = "enabled"
  private const val PROP_SERVICE_ENABLED = "mediaPlaybackServiceEnabled"

  private const val DEFAULT_ENABLED = false
  private const val DEFAULT_SERVICE_ENABLED = true

  fun fromProps(props: ReadableMap?): BackgroundAudioConfig {
    val enabled =
      if (props?.hasKey(PROP_ENABLED) == true) props.getBoolean(PROP_ENABLED) else DEFAULT_ENABLED
    val serviceEnabled =
      if (props?.hasKey(PROP_SERVICE_ENABLED) == true) props.getBoolean(PROP_SERVICE_ENABLED) else DEFAULT_SERVICE_ENABLED
    return BackgroundAudioConfig(enabled, serviceEnabled)
  }
}
