package com.theoplayer.media

data class MediaSessionConfig (
  /**
   * Whether or not the media session should be enabled.
   */
  val mediaSessionEnabled: Boolean = true,

  /**
   * The amount of seconds the player will skip forward.
   */
  val skipForwardInterval: Double = 5.0,

  /**
   * The amount of seconds the player will skip backward.
   */
  val skipBackwardInterval: Double = 5.0,

  /**
   * Whether "skip track" events should be handled the same as "fast-forward/rewind".
   */
  val convertSkipToSeek: Boolean = false,

  /**
   * Whether to allow play/pause of live assets.
   */
  val allowLivePlayPause: Boolean = false,

  /**
   * Whether to seek to live when resuming a live stream.
   */
  val seekToLiveOnResume: Boolean = false,
)
