package com.theoplayer.util;

import android.os.Handler;
import android.os.Looper;
import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.theoplayer.ReactTHEOplayerView;

public class ViewResolver {
  private UIManagerModule uiManager;

  private Handler handler = new Handler(Looper.getMainLooper());

  private final ReactApplicationContext reactContext;

  public interface Callback {
    void onResolved(@Nullable ReactTHEOplayerView view);
  }

  public ViewResolver(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  public void resolveViewByTag(final Integer tag, Callback callback) {
    if (tag == null) {
      callback.onResolved(null);
    }
    if (uiManager == null) {
      uiManager = reactContext.getNativeModule(UIManagerModule.class);
    }
    if (uiManager == null) {
      callback.onResolved(null);
    }
    handler.post(() -> {
      callback.onResolved((ReactTHEOplayerView)uiManager.resolveView(tag));
    });
  }
}
