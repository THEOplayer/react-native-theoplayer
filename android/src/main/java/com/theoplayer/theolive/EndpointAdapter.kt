package com.theoplayer.theolive

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.theolive.ContentProtectionConfiguration
import com.theoplayer.android.api.theolive.Endpoint
import com.theoplayer.android.api.theolive.EndpointMillicastSource
import com.theoplayer.android.api.theolive.FairPlayConfiguration
import com.theoplayer.android.api.theolive.KeySystemConfiguration
import com.theoplayer.android.api.theolive.PlayoutDelay
import com.theoplayer.android.api.theolive.WebRTCOptions

private const val PROP_SRC = "src"
private const val PROP_SRC_TYPE = "srcType"
private const val PROP_PROVIDER = "provider"
private const val PROP_AD_SYSTEM = "adSystem"
private const val PROP_MILLICAST_SRC = "millicastSrc"
private const val PROP_MILLICAST_NAME = "name"
private const val PROP_MILLICAST_ACCOUNTID = "accountId"
private const val PROP_MILLICAST_SUBSCRIBER_TOKEN ="subscriberToken"
private const val PROP_MILLICAST_DIRECTOR_URL = "directorUrl"
private const val PROP_MILLICAST_WEBRTC = "webrtc"
private const val PROP_PLAYOUT_DELAY_MS = "playoutDelayMs"
private const val PROP_PLAYOUT_DELAY_MINIMUM = "minimum"
private const val PROP_PLAYOUT_DELAY_MAXIMUM = "maximum"
private const val PROP_HESP_SRC = "hespSrc"
private const val PROP_HLS_SRC = "hlsSrc"
private const val PROP_HLS_MPEG_TS_SRC = "hlsMpegTsSrc"
private const val PROP_AD_SRC = "adSrc"
private const val PROP_DAI_ASSET_KEY = "daiAssetKey"
private const val PROP_CDN = "cdn"
private const val PROP_TARGET_LATENCY = "targetLatency"
private const val PROP_WEIGHT = "weight"
private const val PROP_PRIORITY = "priority"
private const val PROP_CONTENT_PROTECTION = "contentProtection"
private const val PROP_INTEGRATION = "integration"
private const val PROP_WIDEVINE = "widevine"
private const val PROP_PLAYREADY = "playready"
private const val PROP_FAIRPLAY = "fairplay"
private const val PROP_LICENSE_URL = "licenseUrl"
private const val PROP_CERTIFICATE_URL = "certificateUrl"

private const val SRC_TYPE_HESP = "hesp"
private const val SRC_TYPE_HLS = "hls"
private const val SRC_TYPE_HLS_MPEG_TS = "hlsMpegTs"
private const val SRC_TYPE_MILLICAST = "millicast"
private const val SRC_TYPE_DAI = "dai"

object EndpointAdapter {

  private fun fromPlayoutDelay(playoutDelay: PlayoutDelay): WritableMap {
    return Arguments.createMap().apply {
      putInt(PROP_PLAYOUT_DELAY_MINIMUM, playoutDelay.minimum)
      putInt(PROP_PLAYOUT_DELAY_MAXIMUM, playoutDelay.maximum)
    }
  }

  private fun fromWebrtcOptions(webrtc: WebRTCOptions): WritableMap {
    return Arguments.createMap().apply {
      webrtc.playoutDelayMs?.let { putMap(PROP_PLAYOUT_DELAY_MS, fromPlayoutDelay(it)) }
    }
  }

  fun fromEndPointMillicastSource(millicastSource: EndpointMillicastSource): WritableMap {
    return Arguments.createMap().apply {
      putString(PROP_MILLICAST_NAME , millicastSource.name)
      putString(PROP_MILLICAST_ACCOUNTID, millicastSource.accountId)
      millicastSource.directorUrl?.let { putString(PROP_MILLICAST_DIRECTOR_URL, it) }
      millicastSource.subscriberToken?.let { putString(PROP_MILLICAST_SUBSCRIBER_TOKEN, it) }
      millicastSource.webrtc?.let { putMap(PROP_MILLICAST_WEBRTC, fromWebrtcOptions(it)) }
    }
  }

  fun fromEndpoint(endPoint: Endpoint): WritableMap {
    return Arguments.createMap().apply {
      endPoint.millicastSrc?.let { putMap(PROP_MILLICAST_SRC, fromEndPointMillicastSource(it)) }
      endPoint.hespSrc?.let { putString(PROP_HESP_SRC, it) }
      endPoint.hlsSrc?.let { putString(PROP_HLS_SRC, it) }
      endPoint.hlsMpegTsSrc?.let { putString(PROP_HLS_MPEG_TS_SRC, it) }
      endPoint.adSrc?.let { putString(PROP_AD_SRC, it) }
      endPoint.daiAssetKey?.let { putString(PROP_DAI_ASSET_KEY, it) }
      endPoint.cdn?.let { putString(PROP_CDN, it) }
      // `provider` and `adSystem` are unavailable on older THEOplayer Android
      // SDK versions; guard against builds pinned to an older SDK.
      runCatching { endPoint.provider }.getOrNull()?.let { putString(PROP_PROVIDER, it) }
      runCatching { endPoint.adSystem }.getOrNull()?.let { putString(PROP_AD_SYSTEM, it) }
      endPoint.targetLatency?.let { putDouble(PROP_TARGET_LATENCY, it) }
      putInt(PROP_WEIGHT, endPoint.weight)
      putInt(PROP_PRIORITY, endPoint.priority)
      endPoint.contentProtection?.let {
        putMap(PROP_CONTENT_PROTECTION, fromContentProtection(it))
      }
      // Unlike the web SDK, the native Endpoint does not carry a generic
      // `src`/`srcType`; it is derived from the resolved source field.
      when {
        endPoint.hespSrc != null -> {
          putString(PROP_SRC_TYPE, SRC_TYPE_HESP)
          putString(PROP_SRC, endPoint.hespSrc)
        }
        endPoint.hlsSrc != null -> {
          putString(PROP_SRC_TYPE, SRC_TYPE_HLS)
          putString(PROP_SRC, endPoint.hlsSrc)
        }
        endPoint.hlsMpegTsSrc != null -> {
          putString(PROP_SRC_TYPE, SRC_TYPE_HLS_MPEG_TS)
          putString(PROP_SRC, endPoint.hlsMpegTsSrc)
        }
        endPoint.millicastSrc != null -> {
          putString(PROP_SRC_TYPE, SRC_TYPE_MILLICAST)
          endPoint.millicastSrc?.let { putMap(PROP_SRC, fromEndPointMillicastSource(it)) }
        }
        endPoint.daiAssetKey != null -> {
          putString(PROP_SRC_TYPE, SRC_TYPE_DAI)
          putString(PROP_SRC, endPoint.daiAssetKey)
        }
      }
    }
  }

  fun fromContentProtection(contentProtection: ContentProtectionConfiguration): WritableMap {
    return Arguments.createMap().apply {
      putString(PROP_INTEGRATION, contentProtection.integration)
      contentProtection.widevine?.let { config ->
        putMap(PROP_WIDEVINE, fromKeySystemConfiguration(config))
      }
      contentProtection.playready?.let { config ->
        putMap(PROP_PLAYREADY, fromKeySystemConfiguration(config))
      }
      contentProtection.fairplay?.let { config ->
        putMap(PROP_FAIRPLAY, fromFairPlayConfiguration(config))
      }
    }
  }

  fun fromKeySystemConfiguration(config: KeySystemConfiguration): WritableMap {
    return Arguments.createMap().apply {
      config.licenseUrl?.let { url -> putString(PROP_LICENSE_URL, url) }
    }
  }

  fun fromFairPlayConfiguration(config: FairPlayConfiguration): WritableMap {
    return Arguments.createMap().apply {
      config.licenseUrl?.let { url -> putString(PROP_LICENSE_URL, url) }
      config.certificateUrl?.let { url -> putString(PROP_CERTIFICATE_URL, url) }
    }
  }
}
