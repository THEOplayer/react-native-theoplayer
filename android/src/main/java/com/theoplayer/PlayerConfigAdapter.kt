package com.theoplayer

import android.text.TextUtils
import android.util.Log
import com.facebook.react.bridge.ReadableMap
import com.theoplayer.android.api.THEOplayerConfig
import com.theoplayer.android.api.ads.AdsConfiguration
import com.theoplayer.android.api.ads.AdPreloadType
import com.theoplayer.android.api.ads.GoogleImaConfiguration
import com.theoplayer.android.api.cast.CastStrategy
import com.google.android.gms.cast.framework.CastContext
import com.theoplayer.android.api.pip.PipConfiguration
import com.theoplayer.presentation.PresentationManager
import com.theoplayer.presentation.PresentationManagerConfig

private const val TAG = "PlayerConfigAdapter"
private const val PROP_ADS_CONFIGURATION = "ads"
private const val PROP_LICENSE = "license"
private const val PROP_LICENSE_URL = "licenseUrl"
private const val PROP_CHROMELESS = "chromeless"
private const val PROP_PRELOAD = "preload"
private const val PROP_UI_ENABLED = "uiEnabled"
private const val PROP_GOOGLE_IMA_CONFIGURATION = "googleImaConfiguration"
private const val PROP_USE_NATIVE_IMA = "useNativeIma"
private const val PROP_CAST_CONFIGURATION = "cast"
private const val PROP_CAST_STRATEGY = "strategy"
private const val PROP_CHROMECAST_CONFIG = "chromecast"
private const val PROP_CHROMECAST_APPID = "appID"
private const val PROP_PIP_CONFIG = "pip"
private const val PROP_PIP_RETAIN_ON_SOURCECHANGE = "retainPresentationModeOnSourceChange"
private const val PROP_PIP_AUTO = "canStartPictureInPictureAutomaticallyFromInline"

object PlayerConfigAdapter {

  fun theoConfigFromProps(configProps: ReadableMap?): THEOplayerConfig {
    val configBuilder = THEOplayerConfig.Builder()
    if (configProps != null) {
      val adsConfig = adsConfigurationFromProps(configProps.getMap(PROP_ADS_CONFIGURATION))
      if (adsConfig != null) {
        configBuilder.ads(adsConfig)
      }
      val license = configProps.getString(PROP_LICENSE)
      if (license != null) {
        configBuilder.license(license)
      }
      val licenseUrl = configProps.getString(PROP_LICENSE_URL)
      if (licenseUrl != null) {
        configBuilder.licenseUrl(licenseUrl)
      }
      if (configProps.hasKey(PROP_CHROMELESS)) {
        configBuilder.chromeless(configProps.getBoolean(PROP_CHROMELESS))
      }
      applyCastConfigurationFromProps(configBuilder, configProps.getMap(PROP_CAST_CONFIGURATION))
      configBuilder.pipConfiguration(PipConfiguration.Builder().build())
    }
    return configBuilder.build()
  }

  fun presentationManagerConfigFromProps(configProps: ReadableMap?): PresentationManagerConfig {
    val pip = configProps?.getMap(PROP_PIP_CONFIG)?.toHashMap() ?: emptyMap()
    return PresentationManagerConfig(
      pip[PROP_PIP_RETAIN_ON_SOURCECHANGE] as? Boolean ?: false,
      pip[PROP_PIP_AUTO] as? Boolean ?: false
    )
  }

  private fun adsConfigurationFromProps(configProps: ReadableMap?): AdsConfiguration? {
    if (configProps == null) {
      return null
    }
    val builder = AdsConfiguration.Builder()
    val preloadTypeString = configProps.getString(PROP_PRELOAD)
    if (!TextUtils.isEmpty(preloadTypeString)) {
      builder.preload(AdPreloadType.from(preloadTypeString))
    }
    builder.showCountdown(
      !configProps.hasKey(PROP_UI_ENABLED) || configProps.getBoolean(PROP_UI_ENABLED)
    )
    val googleImaConfiguration = googleImaConfigurationFromProps(
      configProps.getMap(PROP_GOOGLE_IMA_CONFIGURATION)
    )
    if (googleImaConfiguration != null) {
      builder.googleIma(googleImaConfiguration)
    }
    return builder.build()
  }

  private fun applyCastConfigurationFromProps(
    configBuilder: THEOplayerConfig.Builder,
    castConfig: ReadableMap?
  ) {
    if (castConfig == null) {
      return
    }
    val strStrategy = castConfig.getString(PROP_CAST_STRATEGY)
    val castStrategy = castStrategyFromString(strStrategy)
    if (castStrategy != null) {
      configBuilder.castStrategy(castStrategy)
    } else {
      Log.e(TAG, "Unknown cast strategy: $strStrategy")
    }
    val chromecastConfig = castConfig.getMap(PROP_CHROMECAST_CONFIG)
    if (chromecastConfig != null) {
      val appID = chromecastConfig.getString(PROP_CHROMECAST_APPID)
      val castContext = CastContext.getSharedInstance()
      if (appID != null && castContext != null) {
        castContext.setReceiverApplicationId(appID)
      }
    }
  }

  private fun castStrategyFromString(strStrategy: String?): CastStrategy? {
    return when (strStrategy) {
      "auto" -> CastStrategy.AUTO
      "manual" -> CastStrategy.MANUAL
      "disabled" -> CastStrategy.DISABLED
      else -> null
    }
  }

  private fun googleImaConfigurationFromProps(configProps: ReadableMap?): GoogleImaConfiguration? {
    return if (configProps == null) {
      null
    } else GoogleImaConfiguration.Builder()
      .useNativeIma(
        configProps.hasKey(PROP_USE_NATIVE_IMA) && configProps.getBoolean(PROP_USE_NATIVE_IMA)
      )
      .build()
  }
}
