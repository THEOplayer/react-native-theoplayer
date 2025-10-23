package com.theoplayer.media

import com.facebook.react.bridge.ReadableMap

object MediaSessionConfigAdapter {
  private const val PROP_ENABLED = "mediaSessionEnabled"
  private const val PROP_SKIP_FORWARD_INTERVAL = "skipForwardInterval"
  private const val PROP_SKIP_BACKWARD_INTERVAL = "skipBackwardInterval"
  private const val PROP_CONVERT_SKIP = "convertSkipToSeek"
  private const val PROP_ALLOW_LIVE_PLAY_PAUSE = "allowLivePlayPause"
  private const val PROP_SEEK_TO_LIVE_RESUME = "seekToLiveOnResume"

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
      if (props?.hasKey(PROP_CONVERT_SKIP) == true) {
        convertSkipToSeek = props.getBoolean(PROP_CONVERT_SKIP)
      }
      if (props?.hasKey(PROP_ALLOW_LIVE_PLAY_PAUSE) == true) {
        allowLivePlayPause = props.getBoolean(PROP_ALLOW_LIVE_PLAY_PAUSE)
      }
      if (props?.hasKey(PROP_SEEK_TO_LIVE_RESUME) == true) {
        seekToLiveOnResume = props.getBoolean(PROP_SEEK_TO_LIVE_RESUME)
      }
    }
  }
}
