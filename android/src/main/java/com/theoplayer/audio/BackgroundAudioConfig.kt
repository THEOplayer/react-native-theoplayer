package com.theoplayer.audio

data class BackgroundAudioConfig(
  /**
   * Set whether background audio playback is enabled.
   *
   * @defaultValue `false`
   */
  val enabled: Boolean,

  /**
   * Set whether the mediaPlaybackService is enabled.
   *
   * @defaultValue `true`
   */
  val mediaPlaybackServiceEnabled: Boolean
)
