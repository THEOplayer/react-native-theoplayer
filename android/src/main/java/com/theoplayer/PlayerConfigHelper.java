package com.theoplayer;

import android.text.TextUtils;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.theoplayer.android.api.THEOplayerConfig;
import com.theoplayer.android.api.ads.AdPreloadType;
import com.theoplayer.android.api.ads.AdsConfiguration;
import com.theoplayer.android.api.ads.GoogleImaConfiguration;

public class PlayerConfigHelper {
  static final private String PROP_ADS_CONFIGURATION = "ads";
  static final private String PROP_LICENSE = "license";
  static final private String PROP_LICENSE_URL = "licenseUrl";
  static final private String PROP_CHROMELESS = "chromeless";
  static final private String PROP_PRELOAD = "preload";
  static final private String PROP_UI_ENABLED = "uiEnabled";
  static final private String PROP_GOOGLE_IMA_CONFIGURATION = "googleImaConfiguration";
  static final private String PROP_USE_NATIVE_IMA = "useNativeIma";

  static public THEOplayerConfig fromProps(@Nullable ReadableMap configProps) {
    THEOplayerConfig.Builder configBuilder = new THEOplayerConfig.Builder();
    if (configProps != null) {
      AdsConfiguration adsConfig = adsConfigurationFromProps(configProps.getMap(PROP_ADS_CONFIGURATION));
      if (adsConfig != null) {
        configBuilder.ads(adsConfig);
      }
      String license = configProps.getString(PROP_LICENSE);
      if (license != null) {
        configBuilder.license(license);
      }
      String licenseUrl = configProps.getString(PROP_LICENSE_URL);
      if (licenseUrl != null) {
        configBuilder.licenseUrl(licenseUrl);
      }
      if (configProps.hasKey(PROP_CHROMELESS)) {
        configBuilder.chromeless(configProps.getBoolean(PROP_CHROMELESS));
      }
    }
    return configBuilder.build();
  }

  static private AdsConfiguration adsConfigurationFromProps(@Nullable ReadableMap configProps) {
    if (configProps == null) {
      return null;
    }
    AdsConfiguration.Builder builder = new AdsConfiguration.Builder();
    String preloadTypeString = configProps.getString(PROP_PRELOAD);
    if (!TextUtils.isEmpty(preloadTypeString)) {
      builder.preload(AdPreloadType.from(preloadTypeString));
    }
    builder.showCountdown(!configProps.hasKey(PROP_UI_ENABLED) || configProps.getBoolean(PROP_UI_ENABLED));
    GoogleImaConfiguration googleImaConfiguration = googleImaConfigurationFromProps(configProps.getMap(PROP_GOOGLE_IMA_CONFIGURATION));
    if (googleImaConfiguration != null) {
      builder.googleImaConfiguration(googleImaConfiguration);
    }
    return builder.build();
  }

  static private GoogleImaConfiguration googleImaConfigurationFromProps(@Nullable ReadableMap configProps) {
    if (configProps == null) {
      return null;
    }
    return new GoogleImaConfiguration.Builder()
      .useNativeIma(configProps.hasKey(PROP_USE_NATIVE_IMA) && configProps.getBoolean(PROP_USE_NATIVE_IMA))
      .build();
  }
}
