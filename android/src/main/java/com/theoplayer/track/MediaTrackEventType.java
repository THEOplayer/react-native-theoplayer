package com.theoplayer.track;

public enum MediaTrackEventType {
  ACTIVE_QUALITY_CHANGED(0),
  TARGET_QUALITY_CHANGED(1);

  public final int type;
  MediaTrackEventType(int type) {
    this.type = type;
  }
}
