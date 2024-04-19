package com.theoplayer

import android.text.TextUtils
import com.facebook.react.bridge.ReadableMap
import com.google.ads.interactivemedia.v3.api.AdsRenderingSettings
import com.google.ads.interactivemedia.v3.api.ImaSdkFactory
import com.google.ads.interactivemedia.v3.api.ImaSdkSettings
import com.theoplayer.android.api.THEOplayerConfig
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.cast.CastStrategy
import com.theoplayer.android.api.cast.CastConfiguration
import com.theoplayer.android.api.pip.PipConfiguration
import com.theoplayer.android.api.player.NetworkConfiguration
import com.theoplayer.android.api.ui.UIConfiguration

private const val PROP_LICENSE = "license"
private const val PROP_LICENSE_URL = "licenseUrl"
private const val PROP_PRELOAD = "preload"
private const val PROP_LANGUAGE = "language"
private const val PROP_LIVE_OFFSET = "liveOffset"
private const val PROP_UI_ENABLED = "uiEnabled"
private const val PROP_CAST_STRATEGY = "strategy"
private const val PROP_RETRY_CONFIG = "retryConfiguration"
private const val PROP_HLS_DATE_RANGE = "hlsDateRange"
private const val PROP_RETRY_MAX_RETRIES = "maxRetries"
private const val PROP_RETRY_MIN_BACKOFF = "minimumBackoff"
private const val PROP_RETRY_MAX_BACKOFF = "maximumBackoff"
private const val PROP_CAST_CONFIGURATION = "cast"
private const val PROP_ADS_CONFIGURATION = "ads"
private const val PROP_UI_CONFIGURATION = "ui"
private const val PROP_PPID = "ppid"
private const val PROP_MAX_REDIRECTS = "maxRedirects"
private const val PROP_FEATURE_FLAGS = "featureFlags"
private const val PROP_AUTOPLAY_AD_BREAKS = "autoPlayAdBreaks"
private const val PROP_SESSION_ID = "sessionID"
private const val PROP_ENABLE_DEBUG_MODE = "enableDebugMode"

class PlayerConfigAdapter(private val configProps: ReadableMap?) {

  /**
   * Get general THEOplayerConfig object; these properties apply:
   * - license: The license for the player.
   * - licenseUrl: The url to fetch the license for the player.
   * - retryConfiguration: The retry configuration for the player.
   */
  fun playerConfig(): THEOplayerConfig {
    return THEOplayerConfig.Builder().apply {
      configProps?.run {
        getString(PROP_LICENSE)?.let { license ->
          license(license)
        }
        getString(PROP_LICENSE_URL)?.let { licenseUrl ->
          licenseUrl(licenseUrl)
        }
        if (hasKey(PROP_RETRY_CONFIG)) {
          networkConfiguration(networkConfig())
        }
        if (hasKey(PROP_LIVE_OFFSET)) {
          liveOffset(getDouble(PROP_LIVE_OFFSET))
        }
        if (hasKey(PROP_UI_CONFIGURATION)) {
          ui(uiConfig())
        }
        if (hasKey(PROP_HLS_DATE_RANGE)) {
          hlsDateRange(getBoolean(PROP_HLS_DATE_RANGE))
        }
        pipConfiguration(PipConfiguration.Builder().build())
      }
    }.build()
  }

  /**
   * Get NetworkConfiguration object; there properties apply:
   * - maxRetries: The maximum amount of retries before the player throws a fatal error.
   * - minimumBackoff: The initial delay in milliseconds before a retry request occurs.
   * - maximumBackoff: The maximum amount of delay in milliseconds between retry requests.
   */
  private fun networkConfig(): NetworkConfiguration {
    return NetworkConfiguration.Builder().apply {
      configProps?.getMap(PROP_RETRY_CONFIG)?.run {
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

  /**
   * Get ImaSdkSettings object.
   *
   * @see <a href="https://developers.google.com/interactive-media-ads/docs/sdks/android/client-side/api/reference/com/google/ads/interactivemedia/v3/api/ImaSdkSettings">IMA SDK for Android</a>.
   */
  fun imaSdkSettings(): ImaSdkSettings{
    return ImaSdkFactory.getInstance().createImaSdkSettings().apply {
      configProps?.getMap(PROP_ADS_CONFIGURATION)?.run {
        // Specifies whether VMAP and ad rules ad breaks are automatically played.
        if (hasKey(PROP_AUTOPLAY_AD_BREAKS)) {
          autoPlayAdBreaks = getBoolean(PROP_AUTOPLAY_AD_BREAKS)
        }
        // The feature flags and their states.
        if (hasKey(PROP_FEATURE_FLAGS)) {
          val convertedMap: MutableMap<String, String> = mutableMapOf()
          getMap(PROP_FEATURE_FLAGS)?.toHashMap()?.forEach { (key, value) ->
            convertedMap[key] = value as String
          }
          featureFlags = convertedMap
        }
        // The current ISO 639-1 language code, get it from the UI config.
        uiConfig().language?.let {
          language = it
        }
        // The maximum number of VAST redirects.
        if (hasKey(PROP_MAX_REDIRECTS)) {
          maxRedirects = getInt(PROP_MAX_REDIRECTS)
        }
        // The partner provided player type.
        playerType = "THEOplayer"
        // The partner provided player version.
        playerVersion = THEOplayerGlobal.getVersion()
        // The ppid.
        if (hasKey(PROP_PPID)) {
          ppid = getString(PROP_PPID) ?: ""
        }
        // The SessionID.
        if (hasKey(PROP_SESSION_ID)) {
          sessionId = getString(PROP_PPID) ?: ""
        }
        // Whether to enable debug mode.
        if (hasKey(PROP_ENABLE_DEBUG_MODE)) {
          isDebugMode = getBoolean(PROP_ENABLE_DEBUG_MODE)
        }
      }
    }
  }

  /**
   * Create a AdsRenderingSettings object.
   *
   * @see <a href="https://developers.google.com/interactive-media-ads/docs/sdks/android/client-side/api/reference/com/google/ads/interactivemedia/v3/api/AdsRenderingSettings">IMA SDK for Android</a>.
   */
  fun adsRenderSettings(): AdsRenderingSettings {
    return ImaSdkFactory.getInstance().createAdsRenderingSettings().apply {
      configProps?.getMap(PROP_ADS_CONFIGURATION)?.run {
        if (hasKey(PROP_UI_ENABLED) && !getBoolean(PROP_UI_ENABLED)) {
          setUiElements(emptySet())
          disableUi = true
        }
        if (hasKey(PROP_PRELOAD)) {
          val preloadTypeString = getString(PROP_PRELOAD)
          enablePreloading = preloadTypeString !== "none"
        }
      }
    }
  }

  /**
   * Get UIConfiguration object; these properties apply:
   * - language: The language used to localize the ui elements.
   */
  private fun uiConfig(): UIConfiguration {
    return UIConfiguration.Builder().apply {
      configProps?.getMap(PROP_UI_CONFIGURATION)?.run {
        val languageString = getString(PROP_LANGUAGE)
        if (languageString != null && !TextUtils.isEmpty(languageString)) {
          language(languageString)
        }
      }
    }.build()
  }

  /**
   * Get CastConfiguration object; these properties apply:
   * - strategy: The join strategy of the player.
   */
  fun castConfig(): CastConfiguration {
    return CastConfiguration.Builder().apply {
      configProps?.getMap(PROP_CAST_CONFIGURATION)?.run {
        castStrategyFromString(getString(PROP_CAST_STRATEGY))?.let { strategy ->
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
