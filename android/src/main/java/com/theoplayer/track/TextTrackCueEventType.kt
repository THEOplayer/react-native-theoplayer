package com.theoplayer.track

enum class TextTrackCueEventType(val type: Int) {
  ADD_CUE(0),
  REMOVE_CUE(1),
  ENTER_CUE(2),
  EXIT_CUE(3);

  fun type(): Int {
    return this.type
  }
}
