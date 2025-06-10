package com.theoplayer.presentation

data class PipConfig(
  /**
   * Whether Picture in Picture should reparent player to the root.
   *
   * @defaultValue `false`
   */
  val reparentPip: Boolean? = false,
  
  /**
   * Set whether the app should transition to PiP automatically when going to the background.
   *
   * @defaultValue `false`
   */
  val startsAutomatically: Boolean? = false
)
