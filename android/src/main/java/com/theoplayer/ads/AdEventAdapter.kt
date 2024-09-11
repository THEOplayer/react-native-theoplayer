package com.theoplayer.ads

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper
import com.facebook.react.bridge.WritableMap
import com.google.ads.interactivemedia.v3.api.AdError
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.GoogleImaAd
import com.theoplayer.android.api.ads.ima.GoogleImaAdEvent
import com.theoplayer.android.api.ads.ima.GoogleImaAdEventType
import com.theoplayer.android.api.ads.wrapper.AdEventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.ads.AdEvent
import com.theoplayer.android.api.event.ads.AdsEventTypes
import java.util.*

private const val EVENT_PROP_AD = "ad"
private const val EVENT_PROP_TYPE = "type"
private const val EVENT_PROP_SUBTYPE = "subType"

class AdEventAdapter(private val adsApi: AdsApiWrapper, eventEmitter: AdEventEmitter) {
  private val eventListener: AdEventListener = object : AdEventListener {
    override fun <E : AdEvent<*>?> onAdEvent(type: EventType<E>?, ad: Ad?, adData: Map<String, String>?, adError: AdError?) {
      val payload = Arguments.createMap()
      if (type != null) {
        payload.putString(EVENT_PROP_TYPE, mapAdType(type))
      }
      if (ad != null) {
        payload.putMap(EVENT_PROP_AD, AdAdapter.fromAd(ad))
      }
      eventEmitter.emit(payload)
    }

    override fun <E : AdEvent<*>?> onAdBreakEvent(type: EventType<E>?, adBreak: AdBreak?, adData: Map<String, String>?, adError: AdError?) {
      val payload = Arguments.createMap()
      if (type != null) {
        payload.putString(EVENT_PROP_TYPE, mapAdType(type))
      }
      if (adBreak != null) {
        payload.putMap(EVENT_PROP_AD, AdAdapter.fromAdBreak(adBreak))
      }
      eventEmitter.emit(payload)
    }
  }

  interface AdEventEmitter {
    fun emit(payload: WritableMap?)
  }

  init {
    adsApi.addAllEventsListener(eventListener)
  }

  companion object {

    /**
     * Create a native GoogleImaAdEvent from a ReactNative AdEvent.
     */
    fun parseEvent(event: ReadableMap?): GoogleImaAdEvent? {
      val eventType = mapAdType(event?.getString(EVENT_PROP_SUBTYPE))
      return if (event != null && eventType != null) {
        object : GoogleImaAdEvent {
          override val ad: GoogleImaAd?
            get() = AdAdapter.parseAd(event.getMap(EVENT_PROP_AD))
          override val adData: Map<String, String>
            get() = mapOf()
          override fun getDate(): Date {
            return Date()
          }
          override fun getType(): EventType<GoogleImaAdEvent> {
            return eventType
          }
        }
      } else {
        null
      }
    }

    private fun mapAdType(eventType: String?): EventType<GoogleImaAdEvent>? {
      return when (eventType) {
        "adloaded" -> GoogleImaAdEventType.LOADED
        "adbegin" -> GoogleImaAdEventType.STARTED
        "adfirstquartile" -> GoogleImaAdEventType.FIRST_QUARTILE
        "admidpoint" -> GoogleImaAdEventType.MIDPOINT
        "adthirdquartile" -> GoogleImaAdEventType.THIRD_QUARTILE
        "adend" -> GoogleImaAdEventType.COMPLETED
        "adskip" -> GoogleImaAdEventType.SKIPPED
        "aderror" -> GoogleImaAdEventType.AD_ERROR
        "adbuffering" -> GoogleImaAdEventType.AD_BUFFERING
        "adbreakbegin" -> GoogleImaAdEventType.AD_BREAK_STARTED
        "adbreakend" -> GoogleImaAdEventType.AD_BREAK_ENDED
        "adclicked" -> GoogleImaAdEventType.CLICKED
        "adtapped" -> GoogleImaAdEventType.TAPPED
        "adicontapped" -> GoogleImaAdEventType.ICON_TAPPED
        "adiconfallbackimageclosed" -> GoogleImaAdEventType.ICON_FALLBACK_IMAGE_CLOSED
        else -> null /*unknown*/
      }
    }

    private fun mapAdType(eventType: EventType<*>): String {
      return when (eventType) {
        GoogleImaAdEventType.LOADED, AdsEventTypes.AD_LOADED -> "adloaded"
        GoogleImaAdEventType.STARTED, AdsEventTypes.AD_BEGIN -> "adbegin"
        GoogleImaAdEventType.FIRST_QUARTILE, AdsEventTypes.AD_FIRST_QUARTILE -> "adfirstquartile"
        GoogleImaAdEventType.MIDPOINT, AdsEventTypes.AD_MIDPOINT -> "admidpoint"
        GoogleImaAdEventType.THIRD_QUARTILE, AdsEventTypes.AD_THIRD_QUARTILE -> "adthirdquartile"
        GoogleImaAdEventType.COMPLETED, AdsEventTypes.AD_END -> "adend"
        GoogleImaAdEventType.SKIPPED, AdsEventTypes.AD_SKIP -> "adskip"
        GoogleImaAdEventType.AD_ERROR, AdsEventTypes.AD_ERROR -> "aderror"
        GoogleImaAdEventType.AD_BUFFERING -> "adbuffering"
        GoogleImaAdEventType.CONTENT_PAUSE_REQUESTED -> "adbreakbegin"
        GoogleImaAdEventType.CONTENT_RESUME_REQUESTED -> "adbreakend"
        GoogleImaAdEventType.AD_BREAK_STARTED, AdsEventTypes.AD_BREAK_BEGIN -> "adbreakbegin"
        GoogleImaAdEventType.AD_BREAK_ENDED, AdsEventTypes.AD_BREAK_END -> "adbreakend"
        GoogleImaAdEventType.AD_BREAK_FETCH_ERROR -> "aderror"
        GoogleImaAdEventType.CLICKED -> "adclicked"
        GoogleImaAdEventType.TAPPED -> "adtapped"
        GoogleImaAdEventType.ICON_TAPPED -> "adicontapped"
        GoogleImaAdEventType.ICON_FALLBACK_IMAGE_CLOSED -> "adiconfallbackimageclosed"
        AdsEventTypes.ADD_AD -> "addad"
        AdsEventTypes.AD_IMPRESSION -> "adimpression"
        AdsEventTypes.ADD_AD_BREAK -> "addadbreak"
        AdsEventTypes.REMOVE_AD_BREAK -> "removeadbreak"
        AdsEventTypes.AD_BREAK_CHANGE -> "adbreakchange"
        else -> eventType.name.lowercase(Locale.getDefault())
      }
    }
  }

  fun destroy() {
    adsApi.removeAllEventsListener(eventListener)
  }
}
