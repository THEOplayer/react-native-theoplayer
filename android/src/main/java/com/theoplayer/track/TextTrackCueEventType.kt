package com.theoplayer.track

enum class TextTrackCueEventType(val type: Int) {
  ADD_CUE(0),
  REMOVE_CUE(1);

  fun type(): Int {
    return this.type
  }
}
