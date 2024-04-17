package com.theoplayer

import android.text.TextUtils
import com.facebook.react.bridge.ReadableMap
import com.google.ads.interactivemedia.v3.api.AdsRenderingSettings
import com.google.ads.interactivemedia.v3.api.ImaSdkFactory
import com.google.ads.interactivemedia.v3.api.ImaSdkSettings
import com.theoplayer.android.api.THEOplayerConfig
import com.theoplayer.android.api.cast.CastStrategy
import com.theoplayer.android.api.cast.CastConfiguration
import com.theoplayer.android.api.pip.PipConfiguration
import com.theoplayer.android.api.player.NetworkConfiguration
import com.theoplayer.android.api.ui.UIConfiguration
import com.theoplayer.media.MediaSessionConfig
import com.theoplayer.media.MediaSessionConfigAdapter

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
private const val PROP_MEDIA_CONTROL = "mediaControl"


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
        // TODO: bridge all settings
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

  /**
   * Get MediaSession connector configuration; these properties apply:
   * - mediaSessionEnabled: whether or not the media session should be enabled.
   * - skipForwardInterval: the amount of seconds the player will skip forward.
   * - skipBackwardInterval: the amount of seconds the player will skip backward.
   */
  fun mediaSessionConfig(): MediaSessionConfig {
    return MediaSessionConfigAdapter.fromProps(configProps?.getMap(PROP_MEDIA_CONTROL))
  }
}
