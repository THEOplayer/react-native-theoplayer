package com.theoplayer.ads

import com.facebook.react.bridge.Arguments
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.ima.GoogleImaAdEventType
import com.theoplayer.android.api.ads.wrapper.AdEventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.ads.AdEvent
import java.util.*

private const val EVENT_PROP_AD = "ad"
private const val EVENT_PROP_TYPE = "type"
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
  GoogleImaAdEventType.AD_BREAK_FETCH_ERROR
)

class AdEventAdapter(private val adsApi: AdsApiWrapper, eventEmitter: AdEventEmitter) {
  private val eventListener: AdEventListener

  interface AdEventEmitter {
    fun emit(payload: WritableMap?)
  }

  init {
    eventListener = object : AdEventListener {
      override fun <E : AdEvent<*>?> onAdEvent(eventType: EventType<E>?, ad: Ad?) {
        val payload = Arguments.createMap()
        payload.putString(EVENT_PROP_TYPE, mapAdType(eventType))
        if (ad != null) {
          payload.putMap(EVENT_PROP_AD, AdAdapter.fromAd(ad))
        }
        eventEmitter.emit(payload)
      }

      override fun <E : AdEvent<*>?> onAdBreakEvent(eventType: EventType<E>?, adBreak: AdBreak?) {
        val payload = Arguments.createMap()
        payload.putString(EVENT_PROP_TYPE, mapAdType(eventType))
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

  private fun mapAdType(eventType: EventType<*>?): String {
    return when (eventType as GoogleImaAdEventType?) {
      GoogleImaAdEventType.LOADED -> "adloaded"
      GoogleImaAdEventType.STARTED -> "adbegin"
      GoogleImaAdEventType.FIRST_QUARTILE -> "adfirstquartile"
      GoogleImaAdEventType.MIDPOINT -> "admidpoint"
      GoogleImaAdEventType.THIRD_QUARTILE -> "adthirdquartile"
      GoogleImaAdEventType.COMPLETED -> "adend"
      GoogleImaAdEventType.SKIPPED -> "adskip"
      GoogleImaAdEventType.AD_ERROR -> "aderror"
      GoogleImaAdEventType.AD_BUFFERING -> "adbuffering"
      GoogleImaAdEventType.AD_BREAK_STARTED -> "adbreakbegin"
      GoogleImaAdEventType.AD_BREAK_ENDED -> "adbreakend"
      GoogleImaAdEventType.AD_BREAK_FETCH_ERROR -> "aderror"
      else -> eventType!!.getName().lowercase(Locale.getDefault())
    }
  }

  fun destroy() {
    for (eventType in ALL_AD_EVENTS) {
      adsApi.removeEventListener(eventType, eventListener)
    }
  }
}
