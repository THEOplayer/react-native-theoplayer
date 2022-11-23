package com.theoplayer;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.theoplayer.ads.AdsModule;
import com.theoplayer.drm.ContentProtectionModule;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ReactTHEOplayerPackage implements ReactPackage {

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
      List<NativeModule> modules = new ArrayList<>();
      modules.add(new AdsModule(reactContext));
      modules.add(new ContentProtectionModule(reactContext));
      return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(new ReactTHEOplayerViewManager());
    }
}
