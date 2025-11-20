package com.theoplayer.audio

data class BackgroundAudioConfig(
  /**
   * Set whether background audio playback is enabled.
   *
   * @defaultValue `false`
   */
  val enabled: Boolean,

  /**
   * Set whether the player should stop play-out when the app goes to background.
   *
   * @defaultValue `false`
   */
  val stopOnBackground: Boolean = false
)
