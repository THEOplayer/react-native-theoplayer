package com.theoplayer.track;

public enum TextTrackCueEventType {
  ADD_CUE(0),
  REMOVE_CUE(1);

  public  final int type;
  TextTrackCueEventType(int type) {
    this.type = type;
  }
}
