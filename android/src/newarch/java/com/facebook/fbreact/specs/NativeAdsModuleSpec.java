
/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleJavaSpec.js
 *
 * @nolint
 */

package com.facebook.fbreact.specs;

import com.facebook.proguard.annotations.DoNotStrip;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;
import javax.annotation.Nonnull;

public abstract class NativeAdsModuleSpec extends ReactContextBaseJavaModule implements TurboModule {
  public static final String NAME = "THEORCTAdsModule";

  public NativeAdsModuleSpec(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public @Nonnull String getName() {
    return NAME;
  }

  @ReactMethod
  @DoNotStrip
  public abstract void playing(double tag, Promise promise);

  @ReactMethod
  @DoNotStrip
  public abstract void skip(double tag);

  @ReactMethod
  @DoNotStrip
  public abstract void currentAdBreak(double tag, Promise promise);

  @ReactMethod
  @DoNotStrip
  public abstract void currentAds(double tag, Promise promise);

  @ReactMethod
  @DoNotStrip
  public abstract void scheduledAdBreaks(double tag, Promise promise);

  @ReactMethod
  @DoNotStrip
  public abstract void schedule(double tag, ReadableMap ad);

  @ReactMethod
  @DoNotStrip
  public abstract void daiContentTimeForStreamTime(double tag, double time, Promise promise);

  @ReactMethod
  @DoNotStrip
  public abstract void daiStreamTimeForContentTime(double tag, double time, Promise promise);

  @ReactMethod
  @DoNotStrip
  public abstract void daiSnapback(double tag, Promise promise);

  @ReactMethod
  @DoNotStrip
  public abstract void daiSetSnapback(double tag, boolean enabled);

  @ReactMethod
  @DoNotStrip
  public abstract void addFriendlyObstruction(double tag, ReadableMap obstruction);

  @ReactMethod
  @DoNotStrip
  public abstract void removeAllFriendlyObstructions(double tag);
}