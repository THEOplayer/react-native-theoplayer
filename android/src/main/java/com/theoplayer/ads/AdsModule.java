package com.theoplayer.ads;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.theoplayer.SourceHelper;
import com.theoplayer.android.ads.dai.api.GoogleDaiIntegration;
import com.theoplayer.util.ViewResolver;

public class AdsModule extends ReactContextBaseJavaModule {
  private final SourceHelper sourceHelper = new SourceHelper();
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

  // Add an ad break request.
  @ReactMethod
  public void schedule(Integer tag, ReadableMap ad) {
    viewResolver.resolveViewByTag(tag, view -> {
      if (view != null) {
        view.getAdsApi().schedule(sourceHelper.parseAdFromJS(ad));
      }
    });
  }

  // The currently playing ad break.
  @ReactMethod
  public void currentAdBreak(Integer tag, Promise promise) {
    viewResolver.resolveViewByTag(tag, view -> {
      if (view == null) {
        promise.resolve(Arguments.createMap());
      } else {
        promise.resolve(AdInfo.fromAdBreak(view.getAdsApi().getCurrentAdBreak()));
      }
    });
  }

  // List of ad breaks which still need to be played.
  @ReactMethod
  public void scheduledAdBreaks(Integer tag, Promise promise) {
    viewResolver.resolveViewByTag(tag, view -> {
      if (view == null) {
        promise.resolve(Arguments.createMap());
      } else {
        promise.resolve(AdInfo.fromAdBreaks(view.getAdsApi().getScheduledAdBreaks()));
      }
    });
  }

  // Whether a linear ad is currently playing.
  @ReactMethod
  public void playing(Integer tag, Promise promise) {
    viewResolver.resolveViewByTag(tag, view -> {
      if (view == null) {
        promise.resolve(false);
      } else {
        promise.resolve(view.getAdsApi().isPlaying());
      }
    });
  }

  // Skip the current linear ad.
  // NOTE: This will have no effect when the current linear ad is (not yet) skippable.
  @ReactMethod
  public void skip(Integer tag) {
    viewResolver.resolveViewByTag(tag, view -> {
      if (view != null) {
        view.getAdsApi().skip();
      }
    });
  }

  @ReactMethod
  public void daiSnapback(Integer tag, Promise promise) {
    viewResolver.resolveViewByTag(tag, view -> {
      GoogleDaiIntegration daiIntegration = view != null ? view.getDaiIntegration() : null;
      if (daiIntegration == null) {
        promise.resolve(false);
      } else {
        promise.resolve(true);
      }
    });
  }

  @ReactMethod
  public void daiContentTimeForStreamTime(Integer tag, Integer time, Promise promise) {
    viewResolver.resolveViewByTag(tag, view -> {
      GoogleDaiIntegration daiIntegration = view != null ? view.getDaiIntegration() : null;
      if (daiIntegration == null) {
        promise.resolve(time);
      } else {
        promise.resolve((int)(1e03 * daiIntegration.contentTimeForStreamTime(1e-03 * time)));
      }
    });
  }

  @ReactMethod
  public void daiStreamTimeForContentTime(Integer tag, Integer time, Promise promise) {
    viewResolver.resolveViewByTag(tag, view -> {
      GoogleDaiIntegration daiIntegration = view != null ? view.getDaiIntegration() : null;
      if (daiIntegration == null) {
        promise.resolve(time);
      } else {
        promise.resolve((int)(1e03 * daiIntegration.streamTimeForContentTime(1e-03 * time)));
      }
    });
  }
}
