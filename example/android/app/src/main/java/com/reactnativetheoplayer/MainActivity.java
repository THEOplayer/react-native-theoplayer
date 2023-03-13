package com.reactnativetheoplayer;

import android.content.Intent;
import android.content.res.Configuration;
import android.media.AudioManager;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.google.android.gms.cast.framework.CastContext;

public class MainActivity extends ReactActivity {

  @Override
  public void onCreate(Bundle bundle) {
    super.onCreate(bundle);
    // STREAM_MUSIC volume should be changed by the hardware volume controls.
    setVolumeControlStream(AudioManager.STREAM_MUSIC);

    try {
      // lazy load Google Cast context
      CastContext.getSharedInstance(this);
    } catch (Exception e) {
      // cast framework not supported
    }
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ReactNativeTHEOplayer";
  }

  @Override
  public void onUserLeaveHint () {
    this.sendBroadcast(new Intent("onUserLeaveHint"));
    super.onUserLeaveHint();
  }

  @Override
  public void onPictureInPictureModeChanged(boolean isInPictureInPictureMode, Configuration newConfig) {
    super.onPictureInPictureModeChanged(isInPictureInPictureMode, newConfig);
    Intent intent = new Intent("onPictureInPictureModeChanged");
    intent.putExtra("isInPictureInPictureMode", isInPictureInPictureMode);
    this.sendBroadcast(intent);
  }
}
