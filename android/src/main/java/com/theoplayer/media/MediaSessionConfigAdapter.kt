package com.theoplayer.media

import com.facebook.react.bridge.ReadableMap
import com.theoplayer.util.getBooleanOr
import com.theoplayer.util.getDoubleOr

object MediaSessionConfigAdapter {
  private const val PROP_ENABLED = "mediaSessionEnabled"
  private const val PROP_SKIP_FORWARD_INTERVAL = "skipForwardInterval"
  private const val PROP_SKIP_BACKWARD_INTERVAL = "skipBackwardInterval"
  private const val PROP_CONVERT_SKIP = "convertSkipToSeek"
  private const val PROP_ALLOW_LIVE_PLAY_PAUSE = "allowLivePlayPause"
  private const val PROP_SEEK_TO_LIVE_RESUME = "seekToLiveOnResume"

  fun fromProps(props: ReadableMap?): MediaSessionConfig {
    val defaults = MediaSessionConfig()
    return MediaSessionConfig(
      mediaSessionEnabled = props.getBooleanOr(PROP_ENABLED, defaults.mediaSessionEnabled),
      skipForwardInterval = props.getDoubleOr(
        PROP_SKIP_FORWARD_INTERVAL,
        defaults.skipForwardInterval
      ),
      skipBackwardInterval = props.getDoubleOr(
        PROP_SKIP_BACKWARD_INTERVAL,
        defaults.skipBackwardInterval
      ),
      convertSkipToSeek = props.getBooleanOr(PROP_CONVERT_SKIP, defaults.convertSkipToSeek),
      allowLivePlayPause = props.getBooleanOr(
        PROP_ALLOW_LIVE_PLAY_PAUSE,
        defaults.allowLivePlayPause
      ),
      seekToLiveOnResume = props.getBooleanOr(
        PROP_SEEK_TO_LIVE_RESUME,
        defaults.seekToLiveOnResume
      )
    )
  }
}
