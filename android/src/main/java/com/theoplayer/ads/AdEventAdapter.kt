package com.theoplayer.ads

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.GoogleImaAd
import com.theoplayer.android.api.ads.ima.GoogleImaAdEvent
import com.theoplayer.android.api.ads.ima.GoogleImaAdEventType
import com.theoplayer.android.api.ads.wrapper.AdEventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.ads.AdEvent
import java.util.*

private const val EVENT_PROP_AD = "ad"
private const val EVENT_PROP_TYPE = "type"
private const val EVENT_PROP_SUBTYPE = "subType"

private val ALL_AD_EVENTS = arrayOf(
  GoogleImaAdEventType.LOADED,
  GoogleImaAdEventType.AD_BREAK_STARTED,
  GoogleImaAdEventType.STARTED,
  GoogleImaAdEventType.FIRST_QUARTILE,
  GoogleImaAdEventType.MIDPOINT,
  GoogleImaAdEventType.THIRD_QUARTILE,
  GoogleImaAdEventType.COMPLETED,
  GoogleImaAdEventType.AD_BREAK_ENDED,
  GoogleImaAdEventType.SKIPPED,
  GoogleImaAdEventType.AD_ERROR,
  GoogleImaAdEventType.AD_BUFFERING,
  GoogleImaAdEventType.AD_BREAK_FETCH_ERROR,
  GoogleImaAdEventType.CONTENT_PAUSE_REQUESTED,
  GoogleImaAdEventType.CONTENT_RESUME_REQUESTED
)

class AdEventAdapter(private val adsApi: AdsApiWrapper, eventEmitter: AdEventEmitter) {
  private val eventListener: AdEventListener

  interface AdEventEmitter {
    fun emit(payload: WritableMap?)
  }

  init {
    eventListener = object : AdEventListener {
      override fun <E : AdEvent<*>?> onAdEvent(type: EventType<E>?, ad: Ad?, adData: Map<String, String>?) {
        val payload = Arguments.createMap()
        if (type != null) {
          payload.putString(EVENT_PROP_TYPE, mapAdType(type))
        }
        if (ad != null) {
          payload.putMap(EVENT_PROP_AD, AdAdapter.fromAd(ad))
        }
        eventEmitter.emit(payload)
      }

      override fun <E : AdEvent<*>?> onAdBreakEvent(type: EventType<E>?, adBreak: AdBreak?, adData: Map<String, String>?) {
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
    for (eventType in ALL_AD_EVENTS) {
      adsApi.addEventListener(eventType, eventListener)
    }
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
        else -> null /*unknown*/
      }
    }

    private fun mapAdType(eventType: EventType<*>): String {
      return when (eventType as GoogleImaAdEventType) {
        GoogleImaAdEventType.LOADED -> "adloaded"
        GoogleImaAdEventType.STARTED -> "adbegin"
        GoogleImaAdEventType.FIRST_QUARTILE -> "adfirstquartile"
        GoogleImaAdEventType.MIDPOINT -> "admidpoint"
        GoogleImaAdEventType.THIRD_QUARTILE -> "adthirdquartile"
        GoogleImaAdEventType.COMPLETED -> "adend"
        GoogleImaAdEventType.SKIPPED -> "adskip"
        GoogleImaAdEventType.AD_ERROR -> "aderror"
        GoogleImaAdEventType.AD_BUFFERING -> "adbuffering"
        GoogleImaAdEventType.CONTENT_PAUSE_REQUESTED -> "adbreakbegin"
        GoogleImaAdEventType.CONTENT_RESUME_REQUESTED -> "adbreakend"
        GoogleImaAdEventType.AD_BREAK_STARTED -> "adbreakbegin"
        GoogleImaAdEventType.AD_BREAK_ENDED -> "adbreakend"
        GoogleImaAdEventType.AD_BREAK_FETCH_ERROR -> "aderror"
        else -> eventType.getName().lowercase(Locale.getDefault())
      }
    }
  }

  fun destroy() {
    for (eventType in ALL_AD_EVENTS) {
      adsApi.removeEventListener(eventType, eventListener)
    }
  }
}
