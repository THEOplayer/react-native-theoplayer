package com.theoplayer.track;

public enum TrackEventType {
  ADD_TRACK(0),
  REMOVE_TRACK(1),
  CHANGE_TRACK(2);

  public final int type;
  TrackEventType(int type) {
    this.type = type;
  }
}
