package com.theoplayer

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
import com.theoplayer.android.api.theolive.THEOLiveConfig
import com.theoplayer.media.MediaSessionConfig
import com.theoplayer.media.MediaSessionConfigAdapter

private const val PROP_LICENSE = "license"
private const val PROP_LICENSE_URL = "licenseUrl"
private const val PROP_PRELOAD = "preload"
private const val PROP_UI_ENABLED = "uiEnabled"
private const val PROP_CAST_STRATEGY = "strategy"
private const val PROP_RETRY_CONFIG = "retryConfiguration"
private const val PROP_RETRY_MAX_RETRIES = "maxRetries"
private const val PROP_RETRY_MIN_BACKOFF = "minimumBackoff"
private const val PROP_RETRY_MAX_BACKOFF = "maximumBackoff"
private const val PROP_CAST_CONFIGURATION = "cast"
private const val PROP_ADS_CONFIGURATION = "ads"
private const val PROP_IMA_CONFIGURATION = "ima"
private const val PROP_IMA_AD_LOAD_TIMEOUT = "adLoadTimeout"
private const val PROP_IMA_FOCUS_SKIP_BUTTON_WHEN_AVAILABLE = "focusSkipButtonWhenAvailable"
private const val PROP_MEDIA_CONTROL = "mediaControl"
private const val PROP_PPID = "ppid"
private const val PROP_MAX_REDIRECTS = "maxRedirects"
private const val PROP_FEATURE_FLAGS = "featureFlags"
private const val PROP_AUTOPLAY_AD_BREAKS = "autoPlayAdBreaks"
private const val PROP_SESSION_ID = "sessionID"
private const val PROP_ENABLE_DEBUG_MODE = "enableDebugMode"
private const val PROP_BITRATE = "bitrate"
private const val PROP_ALLOWED_MIMETYPES = "allowedMimeTypes"
private const val PROP_THEOLIVE_CONFIG = "theoLive"
private const val PROP_THEOLIVE_EXTERNAL_SESSION_ID = "externalSessionId"
private const val PROP_THEOLIVE_ANALYTICS_DISABLED = "analyticsDisabled"
private const val PROP_THEOLIVE_DISCOVERY_URL = "discoveryUrl"
private const val PROP_MULTIMEDIA_TUNNELING_ENABLED = "tunnelingEnabled"

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
        if (hasKey(PROP_THEOLIVE_CONFIG)) {
          theoLiveConfiguration(theoLiveConfig())
        }
        pipConfiguration(PipConfiguration.Builder().build())
        // Opt-out for auto-integrations for now
        autoIntegrations(false)
        if (hasKey(PROP_MULTIMEDIA_TUNNELING_ENABLED)) {
          tunnelingEnabled(getBoolean(PROP_MULTIMEDIA_TUNNELING_ENABLED))
        }
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
  fun imaSdkSettings(): ImaSdkSettings {
    return ImaSdkFactory.getInstance().createImaSdkSettings().apply {
      configProps?.getMap(PROP_ADS_CONFIGURATION)?.getMap(PROP_IMA_CONFIGURATION)?.run {
        // Specifies whether VMAP and ad rules ad breaks are automatically played.
        if (hasKey(PROP_AUTOPLAY_AD_BREAKS)) {
          autoPlayAdBreaks = getBoolean(PROP_AUTOPLAY_AD_BREAKS)
        }
        // Feature flags and their states. Used to control experimental features.
        if (hasKey(PROP_FEATURE_FLAGS)) {
          val convertedMap: MutableMap<String, String> = mutableMapOf()
          getMap(PROP_FEATURE_FLAGS)?.toHashMap()?.forEach { (key, value) ->
            convertedMap[key] = value as String
          }
          featureFlags = convertedMap
        }
        // The maximum number of VAST redirects.
        if (hasKey(PROP_MAX_REDIRECTS)) {
          maxRedirects = getInt(PROP_MAX_REDIRECTS)
        }
        // The partner provided player type.
        playerType = "THEOplayer"
        // The partner provided player version.
        playerVersion = THEOplayerGlobal.getVersion()
        // The Publisher Provided Identification (PPID) sent with ads request.
        if (hasKey(PROP_PPID)) {
          ppid = getString(PROP_PPID) ?: ""
        }
        // The session ID to identify a single user session. This should be a UUID. It
        // is used exclusively for frequency capping across the user session.
        if (hasKey(PROP_SESSION_ID)) {
          sessionId = getString(PROP_PPID) ?: ""
        }
        // Toggles debug mode which will output detailed log information to the console.
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
        if (hasKey(PROP_ALLOWED_MIMETYPES)) {
          mimeTypes = ArrayList<String>().apply {
            getArray(PROP_ALLOWED_MIMETYPES)?.toArrayList()?.forEach {
              add(it as String)
            }
          }
        }
      }
      // bitrate and timeout are configured under the ima config
      configProps?.getMap(PROP_ADS_CONFIGURATION)?.getMap(PROP_IMA_CONFIGURATION)?.run {
        if (hasKey(PROP_BITRATE)) {
          bitrateKbps = getInt(PROP_BITRATE)
        }

        // The time needs to be in milliseconds on android but seconds on ios.
        // we unify the prop from javascript by multiplying it by 1000 here
        if (hasKey(PROP_IMA_AD_LOAD_TIMEOUT)) {
          setLoadVideoTimeout(getInt(PROP_IMA_AD_LOAD_TIMEOUT) * 1000)
        }

        if (hasKey(PROP_IMA_FOCUS_SKIP_BUTTON_WHEN_AVAILABLE)) {
          focusSkipButtonWhenAvailable = getBoolean(PROP_IMA_FOCUS_SKIP_BUTTON_WHEN_AVAILABLE)
        }
      }
    }
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

  private fun theoLiveConfig (): THEOLiveConfig {
    val config = configProps?.getMap(PROP_THEOLIVE_CONFIG)
    return THEOLiveConfig.Builder(
      externalSessionId = config?.getString(PROP_THEOLIVE_EXTERNAL_SESSION_ID),
      analyticsDisabled = if (config?.hasKey(PROP_THEOLIVE_ANALYTICS_DISABLED) == true)
        config.getBoolean(PROP_THEOLIVE_ANALYTICS_DISABLED)
      else false,
      discoveryUrl = config?.getString(PROP_THEOLIVE_DISCOVERY_URL)
    ).build()
  }
}
