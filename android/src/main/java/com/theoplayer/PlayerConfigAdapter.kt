package com.theoplayer

import android.text.TextUtils
import com.facebook.react.bridge.ReadableMap
import com.google.ads.interactivemedia.v3.api.AdsRenderingSettings
import com.google.ads.interactivemedia.v3.api.ImaSdkFactory
import com.theoplayer.android.api.THEOplayerConfig
import com.theoplayer.android.api.ads.AdsConfiguration
import com.theoplayer.android.api.ads.AdPreloadType
import com.theoplayer.android.api.cast.CastStrategy
import com.theoplayer.android.api.cast.CastConfiguration
import com.theoplayer.android.api.pip.PipConfiguration
import com.theoplayer.android.api.player.NetworkConfiguration

private const val TAG = "PlayerConfigAdapter"
private const val PROP_LICENSE = "license"
private const val PROP_LICENSE_URL = "licenseUrl"
private const val PROP_PRELOAD = "preload"
private const val PROP_UI_ENABLED = "uiEnabled"
private const val PROP_CAST_STRATEGY = "strategy"
private const val PROP_RETRY_CONFIG = "retryConfiguration"
private const val PROP_RETRY_MAX_RETRIES = "maxRetries"
private const val PROP_RETRY_MIN_BACKOFF = "minimumBackoff"
private const val PROP_RETRY_MAX_BACKOFF = "maximumBackoff"

class PlayerConfigAdapter(private val configProps: ReadableMap?) {
  fun playerConfig(): THEOplayerConfig {
    return THEOplayerConfig.Builder().apply {
      configProps?.run {
        getString(PROP_LICENSE)?.let { license ->
          license(license)
        }
        getString(PROP_LICENSE_URL)?.let { licenseUrl ->
          licenseUrl(licenseUrl)
        }
        if (configProps.hasKey(PROP_RETRY_CONFIG)) {
          networkConfiguration(networkConfig(configProps.getMap(PROP_RETRY_CONFIG)))
        }
        pipConfiguration(PipConfiguration.Builder().build())
      }
    }.build()
  }

  private fun networkConfig(configProps: ReadableMap?): NetworkConfiguration {
    return NetworkConfiguration.Builder().apply {
      configProps?.run {
        if (hasKey(PROP_RETRY_MAX_RETRIES)) {
          maxRetries(getInt(PROP_RETRY_MAX_RETRIES))
        }
        if (hasKey(PROP_RETRY_MIN_BACKOFF)) {
          minimumBackOff(getDouble(PROP_RETRY_MIN_BACKOFF).toLong())
        }
        if (hasKey(PROP_RETRY_MAX_BACKOFF)) {
          maximumBackOff(getDouble(PROP_RETRY_MAX_BACKOFF).toLong())
        }
      }
    }.build()
  }

  fun adsConfig(): AdsConfiguration {
    return AdsConfiguration.Builder().apply {
      configProps?.run {
        if (hasKey(PROP_PRELOAD)) {
          val preloadTypeString = getString(PROP_PRELOAD)
          if (!TextUtils.isEmpty(preloadTypeString)) {
            preload(AdPreloadType.from(preloadTypeString))
          }
        }
        if (hasKey(PROP_UI_ENABLED)) {
          showCountdown(getBoolean(PROP_UI_ENABLED))
        }
      }
    }.build()
  }

  fun adsRenderSettings(): AdsRenderingSettings {
    return ImaSdkFactory.getInstance().createAdsRenderingSettings().apply {
      configProps?.run {
        if (hasKey(PROP_UI_ENABLED) && !configProps.getBoolean(PROP_UI_ENABLED)) {
          setUiElements(emptySet())
          disableUi = true
        }
      }
    }
  }

  fun castConfig(): CastConfiguration {
    return CastConfiguration.Builder().apply {
      configProps?.run {
        castStrategyFromString(configProps.getString(PROP_CAST_STRATEGY))?.let { strategy ->
          castStrategy(strategy)
        }
      }
    }.build()
  }

  private fun castStrategyFromString(strStrategy: String?): CastStrategy? {
    return when (strStrategy) {
      "auto" -> CastStrategy.AUTO
      "manual" -> CastStrategy.MANUAL
      "disabled" -> CastStrategy.DISABLED
      else -> null
    }
  }
}
