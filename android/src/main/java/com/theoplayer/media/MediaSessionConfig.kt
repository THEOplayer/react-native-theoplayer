package com.theoplayer.media

data class MediaSessionConfig (
  /**
   * Whether or not the media session should be enabled.
   */
  var mediaSessionEnabled: Boolean = true,

  /**
   * The amount of seconds the player will skip forward.
   */
  var skipForwardInterval: Double = 5.0,

  /**
   * The amount of seconds the player will skip backward.
   */
  var skipBackwardInterval: Double = 5.0,

  /**
   * Whether "skip track" events should be handled the same as "fast-forward/rewind".
   */
  var convertSkipToSeek: Boolean = false,
)
