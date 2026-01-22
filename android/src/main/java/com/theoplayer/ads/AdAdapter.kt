package com.theoplayer.ads

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableArray
import com.google.ads.interactivemedia.v3.api.AdPodInfo
import com.google.ads.interactivemedia.v3.api.UiElement
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.CompanionAd
import com.theoplayer.android.api.ads.ima.GoogleImaAd
import com.theoplayer.android.api.ads.UniversalAdId
import com.theoplayer.android.api.event.ads.AdIntegrationKind
import java.lang.Exception

private const val PROP_AD_SYSTEM = "adSystem"
private const val PROP_AD_INTEGRATION = "integration"
private const val PROP_AD_CUSTOM_INTEGRATION = "customIntegration"
private const val PROP_AD_TYPE = "type"
private const val PROP_AD_ID = "id"
private const val PROP_AD_BREAK = "adBreak"
private const val PROP_AD_COMPANIONS = "companions"
private const val PROP_AD_SKIPOFFSET = "skipOffset"
private const val PROP_AD_CREATIVE_ID = "creativeId"
private const val PROP_AD_DESCRIPTION = "description"
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

private const val INVALID_DOUBLE = -1.0
private const val INVALID_INT = -1

object AdAdapter {
  /**
   * Convert a list of native Ads to a ReactNative Ads.
   */
  fun fromAds(ads: List<Ad?>): WritableArray {
    val payload = Arguments.createArray()
    for (ad in ads) {
      if (ad !== null) {
        payload.pushMap(fromAd(ad, true))
      }
    }
    return payload
  }

  /**
   * Convert a native Ad to a ReactNative Ad.
   */
  fun fromAd(ad: Ad): WritableMap {
    return fromAd(ad, true)
  }

  /**
   * Convert a native Ad to a ReactNative Ad, optionally include its AdBreak.
   */
  private fun fromAd(ad: Ad, includeAdBreak: Boolean): WritableMap {
    val adPayload = Arguments.createMap()
    adPayload.putString(PROP_AD_INTEGRATION, ad.integration.type)
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
        adPayload.putDouble(PROP_AD_DURATION, ad.imaAd.duration)
        adPayload.putDouble(PROP_AD_WIDTH, ad.imaAd.vastMediaWidth.toDouble())
        adPayload.putDouble(PROP_AD_HEIGHT, ad.imaAd.vastMediaHeight.toDouble())
        adPayload.putString(PROP_AD_CONTENT_TYPE, ad.imaAd.contentType)
        adPayload.putString(PROP_AD_DESCRIPTION, ad.imaAd.description)
      } catch (ignore: Exception) {
        // googleImaAd.getImaAd() is not known yet
      }
      val universalAdIdsPayload = Arguments.createArray()
      for (universalAdId in ad.universalAdIds) {
        val idPayload = Arguments.createMap()
        idPayload.putString(
          PROP_UNIVERSAL_AD_ID_REGISTRY,
          universalAdId?.universalAdIdRegistry
        )
        idPayload.putString(PROP_UNIVERSAL_AD_ID_VALUE, universalAdId?.universalAdIdValue)
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

  /**
   * Convert a native AdBreak to a ReactNative AdBreak.
   */
  fun fromAdBreak(adbreak: AdBreak?): WritableMap {
    val adbreakPayload = Arguments.createMap()
    if (adbreak == null) {
      return adbreakPayload
    }
    adbreakPayload.putString(PROP_ADBREAK_INTEGRATION, adbreak.integration.type)
    adbreakPayload.putInt(PROP_ADBREAK_MAXDURATION,adbreak.maxDuration)
    adbreakPayload.putInt(PROP_ADBREAK_TIMEOFFSET, adbreak.timeOffset)
    adbreakPayload.putDouble(PROP_ADBREAK_MAXREMAININGDURATION, adbreak.maxRemainingDuration)
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

  /**
   * Convert a ReactNative Ad to a native Ad.
   */
  fun parseAd(ad: ReadableMap?): GoogleImaAd? {
    if (ad == null) {
      return null
    }
    return object: GoogleImaAd {
      override fun getId(): String {
        return ad.getString(PROP_AD_ID) ?: ""
      }

      override fun getCompanions(): List<CompanionAd> {
        return emptyList()
      }

      override fun getType(): String? {
        return ad.getString(PROP_AD_TYPE)
      }

      override fun getAdBreak(): AdBreak? {
        return parseAdBreak(ad.getMap(PROP_AD_BREAK))
      }

      override fun getSkipOffset(): Int {
        return if (ad.hasKey(PROP_AD_SKIPOFFSET)) ad.getInt(PROP_AD_SKIPOFFSET) else 0
      }

      override fun getIntegration(): AdIntegrationKind {
        return AdIntegrationKind.from(ad.getString(PROP_AD_INTEGRATION)) ?: AdIntegrationKind.CUSTOM
      }

      override fun getCustomIntegration(): String? {
        return ad.getString(PROP_AD_CUSTOM_INTEGRATION)
      }

      override fun getCustomData(): Any? {
        // Not supported yet
        return null
      }

      override val imaAd: com.google.ads.interactivemedia.v3.api.Ad
        get() = parseImaAd(ad)

      override val adSystem: String?
        get() = ad.getString(PROP_AD_SYSTEM)

      override val creativeId: String?
        get() = ad.getString(PROP_AD_CREATIVE_ID)

      override val wrapperAdIds: List<String?>
        get() = emptyList()

      override val wrapperAdSystems: List<String?>
        get() = emptyList()

      override val wrapperCreativeIds: List<String?>
        get() = emptyList()

      override val vastMediaBitrate: Int
        get() = if (ad.hasKey(PROP_AD_BITRATE)) ad.getInt(PROP_AD_BITRATE) else 0

      override val universalAdIds: List<UniversalAdId?>
        get() = emptyList()

      override val traffickingParameters: String
        get() = ad.getString(PROP_AD_TRAFFICKING_PARAMETERS) ?: ""
    }
  }

  fun parseAdBreak(adBreak: ReadableMap?): AdBreak? {
    if (adBreak == null) {
      return null
    }
    return object: AdBreak {
      override fun getAds(): List<Ad> {
        return emptyList()
      }

      override fun getMaxDuration(): Int {
        return if (adBreak.hasKey(PROP_ADBREAK_MAXDURATION))
          adBreak.getInt(PROP_ADBREAK_MAXDURATION)
        else
          INVALID_INT
      }

      override fun getMaxRemainingDuration(): Double {
        return if (adBreak.hasKey(PROP_ADBREAK_MAXREMAININGDURATION))
          adBreak.getDouble(PROP_ADBREAK_MAXREMAININGDURATION)
        else
          INVALID_DOUBLE
      }

      override fun getTimeOffset(): Int {
        return if (adBreak.hasKey(PROP_ADBREAK_TIMEOFFSET))
          adBreak.getInt(PROP_ADBREAK_TIMEOFFSET)
        else
          0
      }

      override fun getIntegration(): AdIntegrationKind {
        return AdIntegrationKind.from(adBreak.getString(PROP_ADBREAK_INTEGRATION)) ?: AdIntegrationKind.CUSTOM
      }

      override fun getCustomIntegration(): String? {
        return adBreak.getString(PROP_AD_CUSTOM_INTEGRATION)
      }

      override fun getCustomData(): Any? {
        // Not supported yet
        return null
      }
    }
  }

  fun parseImaAd(ad: ReadableMap?): com.google.ads.interactivemedia.v3.api.Ad {
    return object: com.google.ads.interactivemedia.v3.api.Ad {
      override fun getDuration(): Double {
        return ad?.run {
          if (hasKey(PROP_AD_DURATION)) getDouble(PROP_AD_DURATION) else INVALID_DOUBLE
        } ?: INVALID_DOUBLE
      }

      override fun getSkipTimeOffset(): Double {
        return ad?.run {
          if (hasKey(PROP_AD_SKIPOFFSET)) getDouble(PROP_AD_SKIPOFFSET) else INVALID_DOUBLE
        } ?: INVALID_DOUBLE
      }

      override fun getHeight(): Int {
        return ad?.run {
          if (hasKey(PROP_AD_HEIGHT)) getInt(PROP_AD_HEIGHT) else INVALID_INT
        } ?: INVALID_INT
      }

      override fun getVastMediaBitrate(): Int {
        return ad?.run {
          if (hasKey(PROP_AD_BITRATE)) getInt(PROP_AD_BITRATE) else INVALID_INT
        } ?: INVALID_INT
      }

      override fun getVastMediaHeight(): Int {
        return ad?.run {
          if (hasKey(PROP_AD_HEIGHT)) getInt(PROP_AD_HEIGHT) else INVALID_INT
        } ?: INVALID_INT
      }

      override fun getVastMediaWidth(): Int {
        return ad?.run {
          if (hasKey(PROP_AD_WIDTH)) getInt(PROP_AD_WIDTH) else INVALID_INT
        } ?: INVALID_INT
      }

      override fun getWidth(): Int {
        return ad?.run {
          if (hasKey(PROP_AD_WIDTH)) getInt(PROP_AD_WIDTH) else INVALID_INT
        } ?: INVALID_INT
      }

      override fun getAdPodInfo(): AdPodInfo {
        return object: AdPodInfo {
          override fun getMaxDuration(): Double {
            return INVALID_DOUBLE
          }

          override fun getTimeOffset(): Double {
            return INVALID_DOUBLE
          }

          override fun getAdPosition(): Int {
            return INVALID_INT
          }

          override fun getPodIndex(): Int {
            return INVALID_INT
          }

          override fun getTotalAds(): Int {
            return INVALID_INT
          }

          override fun isBumper(): Boolean {
            return false
          }
        }
      }

      override fun getAdId(): String {
        return ad?.getString(PROP_AD_ID) ?: ""
      }

      override fun getAdSystem(): String {
        return ad?.getString(PROP_AD_SYSTEM) ?: ""
      }

      override fun getAdvertiserName(): String {
        return ""
      }

      override fun getContentType(): String {
        return ad?.getString(PROP_AD_CONTENT_TYPE) ?: ""
      }

      override fun getCreativeAdId(): String {
        return ""
      }

      override fun getCreativeId(): String {
        return ad?.getString(PROP_AD_CREATIVE_ID) ?: ""
      }

      override fun getDealId(): String {
        return ""
      }

      override fun getDescription(): String {
        return ad?.getString(PROP_AD_DESCRIPTION) ?: ""
      }

      override fun getSurveyUrl(): String {
        return ""
      }

      override fun getTitle(): String {
        return ad?.getString(PROP_AD_TITLE) ?: ""
      }

      override fun getTraffickingParameters(): String {
        return ad?.getString(PROP_AD_TRAFFICKING_PARAMETERS) ?: ""
      }

      @Deprecated("Deprecated in Java")
      override fun getUniversalAdIdRegistry(): String {
        return ""
      }

      @Deprecated("Deprecated in Java")
      override fun getUniversalAdIdValue(): String {
        return ad?.getString(PROP_UNIVERSAL_AD_ID_VALUE) ?: ""
      }

      override fun getCompanionAds(): List<com.google.ads.interactivemedia.v3.api.CompanionAd> {
        return emptyList()
      }

      override fun getUiElements(): Set<UiElement> {
        return emptySet()
      }

      override fun isLinear(): Boolean {
        // Only linear ads are supported currently
        return true
      }

      override fun isSkippable(): Boolean {
        return false
      }

      override fun isUiDisabled(): Boolean {
        return false
      }

      override fun getUniversalAdIds(): Array<com.google.ads.interactivemedia.v3.api.UniversalAdId> {
        return emptyArray()
      }

      override fun getAdWrapperCreativeIds(): Array<String> {
        return emptyArray()
      }

      override fun getAdWrapperIds(): Array<String> {
        return emptyArray()
      }

      override fun getAdWrapperSystems(): Array<String> {
        return emptyArray()
      }
    }
  }
}
