package com.theoplayer.presentation

/**
 * Provide information on how the PiP window transitioned.
 */
enum class PresentationModeChangePipContext {

  // The PiP window was closed.
  CLOSED,

  // The PiP window transitioned back into the app.
  RESTORED
}

data class PresentationModeChangeContext(
  val pip: PresentationModeChangePipContext?
)
