package com.theoplayer.media

import com.facebook.react.bridge.ReadableMap

object MediaSessionConfigAdapter {
  private const val PROP_ENABLED = "mediaSessionEnabled"
  private const val PROP_SKIP_FORWARD_INTERVAL = "skipForwardInterval"
  private const val PROP_SKIP_BACKWARD_INTERVAL = "skipBackwardInterval"

  fun fromProps(props: ReadableMap?): MediaSessionConfig {
    return MediaSessionConfig().apply {
      if (props?.hasKey(PROP_ENABLED) == true) {
        mediaSessionEnabled = props.getBoolean(PROP_ENABLED)
      }
      if (props?.hasKey(PROP_SKIP_FORWARD_INTERVAL) == true) {
        skipForwardInterval = props.getDouble(PROP_SKIP_FORWARD_INTERVAL)
      }
      if (props?.hasKey(PROP_SKIP_BACKWARD_INTERVAL) == true) {
        skipBackwardInterval = props.getDouble(PROP_SKIP_BACKWARD_INTERVAL)
      }
    }
  }
}
