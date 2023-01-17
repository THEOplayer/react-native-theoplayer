package com.reactnativetheoplayer;

import android.os.Bundle;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;
import com.google.android.gms.cast.framework.CastContext;

public class MainActivity extends ReactActivity {

  @Override
  public void onCreate(Bundle bundle) {
    super.onCreate(bundle);
    getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

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
}
