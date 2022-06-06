package com.theoplayer;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReadableMap;
import com.theoplayer.android.api.THEOplayerConfig;

public class PlayerConfigHelper {
  static final private String PROP_LICENSE = "license";
  static final private String PROP_LICENSE_URL = "licenseUrl";
  static final private String PROP_CHROMELESS = "chromeless";

  static public THEOplayerConfig fromProps(@Nullable ReadableMap configProps) {
    THEOplayerConfig.Builder configBuilder = new THEOplayerConfig.Builder();
    if (configProps != null) {
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
}
