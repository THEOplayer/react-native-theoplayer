package com.theoplayer.track;

public enum MediaTrackType {
  AUDIO(0),
  VIDEO(1);

  public final int type;
  MediaTrackType(int type) {
    this.type = type;
  }
}
