package com.theoplayer.ads;

import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.theoplayer.android.api.player.Player;
import com.theoplayer.util.ViewResolver;

public class AdsModule extends ReactContextBaseJavaModule {
  private static final String TAG = AdsModule.class.getName();

  private final ViewResolver viewResolver;

  public AdsModule(ReactApplicationContext context) {
    super(context);
    viewResolver = new ViewResolver(context);
  }

  @NonNull
  @Override
  public String getName() {
    return "AdsModule";
  }

  @ReactMethod
  public void schedule(Integer tag, ReadableMap ad) {
    // TODO
  }

  @ReactMethod
  public void currentAdBreak(Integer tag, Callback successCallBack) {
    viewResolver.resolveViewByTag(tag, view -> {
      Player player = view != null ? view.getPlayer() : null;
      if (player == null) {
        Log.e(TAG, "Invalid player tag " + tag);
        successCallBack.invoke(Arguments.createMap());
      } else {
        successCallBack.invoke(AdInfo.fromAdbreak(player.getAds().getCurrentAdBreak()));
      }
    });
  }

  // Whether a linear ad is currently playing.
  @ReactMethod
  public void playing(Integer tag, Callback successCallBack) {
    viewResolver.resolveViewByTag(tag, view -> {
      Player player = view != null ? view.getPlayer() : null;
      if (player == null) {
        Log.e(TAG, "Invalid player tag " + tag);
        successCallBack.invoke(false);
      } else {
        successCallBack.invoke(player.getAds().isPlaying());
      }
    });
  }

  // Skip the current linear ad.
  // NOTE: This will have no effect when the current linear ad is (not yet) skippable.
  @ReactMethod
  public void skip(Integer tag) {
    viewResolver.resolveViewByTag(tag, view -> {
      Player player = view != null ? view.getPlayer() : null;
      if (player == null) {
        Log.e(TAG, "Invalid player tag " + tag);
      } else {
        player.getAds().skip();
      }
    });
  }
}
