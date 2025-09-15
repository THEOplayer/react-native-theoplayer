package com.theoplayer.theoads

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.ads.theoads.TheoAdsIntegration
import com.theoplayer.android.api.ads.theoads.event.InterstitialErrorEvent
import com.theoplayer.android.api.ads.theoads.event.InterstitialEvent
import com.theoplayer.android.api.ads.theoads.event.TheoAdsErrorEvent
import com.theoplayer.android.api.ads.theoads.event.TheoAdsEvent
import com.theoplayer.android.api.ads.theoads.event.TheoAdsEventTypes

private const val EVENT_PROP_TYPE = "type"
private const val EVENT_PROP_INTERSTITIAL = "interstitial"
private const val EVENT_PROP_MESSAGE = "message"

private val FORWARDED_EVENTS = listOf(
  TheoAdsEventTypes.ADD_INTERSTITIAL,
  TheoAdsEventTypes.INTERSTITIAL_BEGIN,
  TheoAdsEventTypes.INTERSTITIAL_END,
  TheoAdsEventTypes.INTERSTITIAL_UPDATE,
  TheoAdsEventTypes.INTERSTITIAL_ERROR,
  TheoAdsEventTypes.THEOADS_ERROR
)

class THEOadsEventAdapter(private val api: TheoAdsIntegration, private val emitter: Emitter) {
  interface Emitter {
    fun emit(payload: WritableMap?)
  }

  init {
    FORWARDED_EVENTS.forEach { api.addEventListener(it, this::onEvent) }
  }

  fun destroy() {
    FORWARDED_EVENTS.forEach { api.removeEventListener(it, this::onEvent) }
  }

  private fun onEvent(event: TheoAdsEvent<*>) {
    emitter.emit(Arguments.createMap().apply {
      putString(EVENT_PROP_TYPE, event.type.name)
      (event as? InterstitialEvent)?.let {
        putMap(EVENT_PROP_INTERSTITIAL, THEOadsAdapter.fromInterstitial(event.interstitial))
      }
      (event as? TheoAdsErrorEvent)?.let {
        putString(EVENT_PROP_MESSAGE, event.message)
      }
      (event as? InterstitialErrorEvent)?.let {
        putString(EVENT_PROP_MESSAGE, event.message)
      }
    })
  }
}
