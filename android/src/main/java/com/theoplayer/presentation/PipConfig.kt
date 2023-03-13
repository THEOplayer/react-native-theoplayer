package com.theoplayer.presentation

data class PipConfig(
  /**
   * Set whether the app should transition to PiP automatically when going to the background.
   *
   * @defaultValue `false`
   */
  val startsAutomatically: Boolean? = false
)
