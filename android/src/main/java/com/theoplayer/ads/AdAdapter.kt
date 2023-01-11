package com.theoplayer.ads

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableArray
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.CompanionAd
import com.theoplayer.android.api.ads.GoogleImaAd
import java.lang.Exception

private const val PROP_AD_SYSTEM = "adSystem"
private const val PROP_AD_INTEGRATION = "integration"
private const val PROP_AD_TYPE = "type"
private const val PROP_AD_ID = "id"
private const val PROP_AD_BREAK = "adBreak"
private const val PROP_AD_COMPANIONS = "companions"
private const val PROP_AD_SKIPOFFSET = "skipOffset"
private const val PROP_AD_CREATIVE_ID = "creativeId"
private const val PROP_AD_TRAFFICKING_PARAMETERS = "traffickingParametersString"
private const val PROP_AD_BITRATE = "bitrate"
private const val PROP_AD_UNIVERSAL_AD_IDS = "universalAdIds"
private const val PROP_AD_TITLE = "title"
private const val PROP_AD_DURATION = "duration"
private const val PROP_AD_WRAPPER_AD_IDS = "wrapperAdIds"
private const val PROP_AD_WRAPPER_AD_SYSTEMS = "wrapperAdSystems"
private const val PROP_AD_WRAPPER_CREATIVE_IDS = "wrapperCreativeIds"
private const val PROP_AD_WIDTH = "width"
private const val PROP_AD_HEIGHT = "height"
private const val PROP_AD_CONTENT_TYPE = "contentType"
private const val PROP_ADBREAK_INTEGRATION = "integration"
private const val PROP_ADBREAK_MAXDURATION = "maxDuration"
private const val PROP_ADBREAK_TIMEOFFSET = "timeOffset"
private const val PROP_ADBREAK_MAXREMAININGDURATION = "maxRemainingDuration"
private const val PROP_ADBREAK_ADS = "ads"
private const val PROP_COMPANION_ADSLOTID = "adSlotId"
private const val PROP_COMPANION_ALTTEXT = "altText"
private const val PROP_COMPANION_CLICKTHROUGH = "clickThrough"
private const val PROP_COMPANION_WIDTH = "width"
private const val PROP_COMPANION_HEIGHT = "height"
private const val PROP_COMPANION_RESOURCEURI = "resourceURI"
private const val PROP_UNIVERSAL_AD_ID_REGISTRY = "adIdRegistry"
private const val PROP_UNIVERSAL_AD_ID_VALUE = "adIdValue"

object AdAdapter {
  fun fromAd(ad: Ad): WritableMap {
    return fromAd(ad, true)
  }

  @JvmStatic
  fun fromAds(ads: List<Ad>): WritableArray {
    val payload = Arguments.createArray()
    for (ad in ads) {
      payload.pushMap(fromAd(ad, true))
    }
    return payload
  }

  private fun fromAd(ad: Ad, includeAdBreak: Boolean): WritableMap {
    val adPayload = Arguments.createMap()
    adPayload.putString(
      PROP_AD_INTEGRATION, if (ad.integration != null) ad.integration!!
        .type else ""
    )
    adPayload.putString(PROP_AD_TYPE, ad.type)
    adPayload.putString(PROP_AD_ID, ad.id)
    val adBreak = ad.adBreak
    if (includeAdBreak && adBreak != null) {
      adPayload.putMap(PROP_AD_BREAK, fromAdBreak(adBreak))
    }
    adPayload.putArray(PROP_AD_COMPANIONS, fromCompanions(ad.companions))
    adPayload.putInt(PROP_AD_SKIPOFFSET, ad.skipOffset)
    if (ad is GoogleImaAd) {
      adPayload.putString(PROP_AD_SYSTEM, ad.adSystem)
      adPayload.putString(PROP_AD_CREATIVE_ID, ad.creativeId)
      adPayload.putString(PROP_AD_TRAFFICKING_PARAMETERS, ad.traffickingParameters)
      adPayload.putInt(PROP_AD_BITRATE, ad.vastMediaBitrate)
      try {
        adPayload.putString(PROP_AD_TITLE, ad.imaAd.title)
        adPayload.putInt(PROP_AD_DURATION, (1e3 * ad.imaAd.duration).toInt())
        adPayload.putDouble(PROP_AD_WIDTH, ad.imaAd.vastMediaWidth.toDouble())
        adPayload.putDouble(PROP_AD_HEIGHT, ad.imaAd.vastMediaHeight.toDouble())
        adPayload.putString(PROP_AD_CONTENT_TYPE, ad.imaAd.contentType)
      } catch (ignore: Exception) {
        // googleImaAd.getImaAd() is not known yet
      }
      val universalAdIdsPayload = Arguments.createArray()
      for (universalAdId in ad.universalAdIds) {
        val idPayload = Arguments.createMap()
        idPayload.putString(
          PROP_UNIVERSAL_AD_ID_REGISTRY,
          universalAdId.universalAdIdRegistry
        )
        idPayload.putString(PROP_UNIVERSAL_AD_ID_VALUE, universalAdId.universalAdIdValue)
        universalAdIdsPayload.pushMap(idPayload)
      }
      adPayload.putArray(PROP_AD_UNIVERSAL_AD_IDS, universalAdIdsPayload)
      val wrapperAdIdsPayload = Arguments.createArray()
      for (wrapperAdId in ad.wrapperAdIds) {
        wrapperAdIdsPayload.pushString(wrapperAdId)
      }
      adPayload.putArray(PROP_AD_WRAPPER_AD_IDS, wrapperAdIdsPayload)
      val wrapperAdSystemsPayload = Arguments.createArray()
      for (wrapperAdSystem in ad.wrapperAdSystems) {
        wrapperAdSystemsPayload.pushString(wrapperAdSystem)
      }
      adPayload.putArray(PROP_AD_WRAPPER_AD_SYSTEMS, wrapperAdSystemsPayload)
      val wrapperCreativeIdsPayload = Arguments.createArray()
      for (wrapperCreativeId in ad.wrapperCreativeIds) {
        wrapperCreativeIdsPayload.pushString(wrapperCreativeId)
      }
      adPayload.putArray(PROP_AD_WRAPPER_CREATIVE_IDS, wrapperCreativeIdsPayload)
    }
    return adPayload
  }

  @JvmStatic
  fun fromAdBreak(adbreak: AdBreak?): WritableMap {
    val adbreakPayload = Arguments.createMap()
    if (adbreak == null) {
      return adbreakPayload
    }
    adbreakPayload.putString(PROP_ADBREAK_INTEGRATION, adbreak.integration.type)
    adbreakPayload.putInt(PROP_ADBREAK_MAXDURATION, (1e3 * adbreak.maxDuration).toInt())
    adbreakPayload.putInt(PROP_ADBREAK_TIMEOFFSET, (1e3 * adbreak.timeOffset).toInt())
    adbreakPayload.putInt(
      PROP_ADBREAK_MAXREMAININGDURATION,
      (1e3 * adbreak.maxRemainingDuration).toInt()
    )
    val adsPayload = Arguments.createArray()
    for (ad in adbreak.ads) {
      // Some ads in the ad break are possibly not loaded yet.
      if (ad != null) {
        adsPayload.pushMap(fromAd(ad, false))
      }
    }
    adbreakPayload.putArray(PROP_ADBREAK_ADS, adsPayload)
    return adbreakPayload
  }

  @JvmStatic
  fun fromAdBreaks(adbreaks: List<AdBreak?>): WritableArray {
    val payload = Arguments.createArray()
    for (adbreak in adbreaks) {
      payload.pushMap(fromAdBreak(adbreak))
    }
    return payload
  }

  private fun fromCompanions(companions: List<CompanionAd>): WritableArray {
    val companionsPayload = Arguments.createArray()
    for (companionAd in companions) {
      val adPayload = Arguments.createMap()
      adPayload.putString(PROP_COMPANION_ADSLOTID, companionAd.adSlotId)
      adPayload.putString(PROP_COMPANION_ALTTEXT, companionAd.altText)
      adPayload.putString(PROP_COMPANION_CLICKTHROUGH, companionAd.clickThrough)
      adPayload.putInt(PROP_COMPANION_WIDTH, companionAd.width)
      adPayload.putInt(PROP_COMPANION_HEIGHT, companionAd.height)
      adPayload.putString(PROP_COMPANION_RESOURCEURI, companionAd.resourceURI)
      companionsPayload.pushMap(adPayload)
    }
    return companionsPayload
  }
}
