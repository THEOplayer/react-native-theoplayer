package com.theoplayer.theolive

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.theolive.ContentProtectionConfiguration
import com.theoplayer.android.api.theolive.Endpoint
import com.theoplayer.android.api.theolive.EndpointMillicastSource
import com.theoplayer.android.api.theolive.FairPlayConfiguration
import com.theoplayer.android.api.theolive.KeySystemConfiguration

private const val PROP_MILLICAST_SRC = "millicastSrc"
private const val PROP_MILLICAST_NAME = "name"
private const val PROP_MILLICAST_ACCOUNTID = "accountId"
private const val PROP_MILLICAST_SUBSCRIBER_TOKEN ="subscriberToken"
private const val PROP_MILLICAST_DIRECTOR_URL = "directorUrl"
private const val PROP_HESP_SRC = "hespSrc"
private const val PROP_HLS_SRC = "hlsSrc"
private const val PROP_AD_SRC = "adSrc"
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

object EndpointAdapter {

  fun fromEndPointMillicastSource(millicastSource: EndpointMillicastSource): WritableMap {
    return Arguments.createMap().apply {
      putString(PROP_MILLICAST_NAME , millicastSource.name)
      putString(PROP_MILLICAST_ACCOUNTID, millicastSource.accountId)
      millicastSource.directorUrl?.let { putString(PROP_MILLICAST_DIRECTOR_URL, it) }
      millicastSource.subscriberToken?.let { putString(PROP_MILLICAST_SUBSCRIBER_TOKEN, it) }
    }
  }

  fun fromEndpoint(endPoint: Endpoint): WritableMap {
    return Arguments.createMap().apply {
      endPoint.millicastSrc?.let { putMap(PROP_MILLICAST_SRC, fromEndPointMillicastSource(it)) }
      endPoint.hespSrc?.let { putString(PROP_HESP_SRC, it) }
      endPoint.hlsSrc?.let { putString(PROP_HLS_SRC, it) }
      endPoint.adSrc?.let { putString(PROP_AD_SRC, it) }
      endPoint.cdn?.let { putString(PROP_CDN, it) }
      endPoint.targetLatency?.let { putDouble(PROP_TARGET_LATENCY, it) }
      putInt(PROP_WEIGHT, endPoint.weight)
      putInt(PROP_PRIORITY, endPoint.priority)
      endPoint.contentProtection?.let {
        putMap(PROP_CONTENT_PROTECTION, fromContentProtection(it))
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
