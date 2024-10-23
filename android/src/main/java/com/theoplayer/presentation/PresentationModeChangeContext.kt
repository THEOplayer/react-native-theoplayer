package com.theoplayer.presentation

/**
 * Provide information on how the PiP window transitioned.
 */
enum class PresentationModeChangePipContext {

  // The PiP window was closed.
  CLOSED,

  // The PiP window transitioned back into the app.
  RESTORED,

  // The app transitioning to PiP frame
  TRANSITIONING_TO_PIP
}

data class PresentationModeChangeContext(
  val pip: PresentationModeChangePipContext?
)
