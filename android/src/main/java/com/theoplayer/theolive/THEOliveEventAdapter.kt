package com.theoplayer.theolive

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.event.player.theolive.DistributionLoadStartEvent
import com.theoplayer.android.api.event.player.theolive.DistributionOfflineEvent
import com.theoplayer.android.api.event.player.theolive.EndpointLoadedEvent
import com.theoplayer.android.api.event.player.theolive.IntentToFallbackEvent
import com.theoplayer.android.api.event.player.theolive.TheoLiveEventTypes
import com.theoplayer.android.api.player.theolive.TheoLive
import com.theoplayer.util.PayloadBuilder

private const val EVENT_PROP_TYPE = "type"
private const val EVENT_PROP_DISTRIBUTION_ID = "distributionId"
private const val EVENT_PROP_ENDPOINT = "endpoint"
private const val EVENT_PROP_REASON = "reason"

class THEOliveEventAdapter(private val theoLiveApi: TheoLive, private val emitter: Emitter) {

  interface Emitter {
    fun emit(payload: WritableMap?)
  }

  init {
    theoLiveApi.addEventListener(TheoLiveEventTypes.DISTRIBUTIONLOADSTART, this::onDistributionLoadStart)
    theoLiveApi.addEventListener(TheoLiveEventTypes.DISTRIBUTIONOFFLINE, this::onDistributionOffline)
    theoLiveApi.addEventListener(TheoLiveEventTypes.ENDPOINTLOADED, this::onEndPointLoaded)
    theoLiveApi.addEventListener(TheoLiveEventTypes.INTENTTOFALLBACK, this::onIntentOfFallback)
  }

  fun destroy() {
    theoLiveApi.removeEventListener(TheoLiveEventTypes.DISTRIBUTIONLOADSTART, this::onDistributionLoadStart)
    theoLiveApi.removeEventListener(TheoLiveEventTypes.DISTRIBUTIONOFFLINE, this::onDistributionOffline)
    theoLiveApi.removeEventListener(TheoLiveEventTypes.ENDPOINTLOADED, this::onEndPointLoaded)
    theoLiveApi.removeEventListener(TheoLiveEventTypes.INTENTTOFALLBACK, this::onIntentOfFallback)
  }

  private fun onDistributionLoadStart(event: DistributionLoadStartEvent) {
    emitter.emit(Arguments.createMap().apply {
      putString(EVENT_PROP_TYPE, "distributionloadstart")
      putString(EVENT_PROP_DISTRIBUTION_ID, event.getDistributionId())
    })
  }

  private fun onDistributionOffline(event: DistributionOfflineEvent) {
    emitter.emit(Arguments.createMap().apply {
      putString(EVENT_PROP_TYPE, "distributionoffline")
      putString(EVENT_PROP_DISTRIBUTION_ID, event.getDistributionId())
    })
  }

  private fun onEndPointLoaded(event: EndpointLoadedEvent) {
    emitter.emit(Arguments.createMap().apply {
      putString(EVENT_PROP_TYPE, "endpointloaded")
      putMap(EVENT_PROP_ENDPOINT, EndpointAdapter.fromEndpoint(event.getEndpoint()))
    })
  }

  private fun onIntentOfFallback(event: IntentToFallbackEvent) {
    emitter.emit(Arguments.createMap().apply {
      putString(EVENT_PROP_TYPE, "intenttofallback")
      event.reason?.let {
        putMap(EVENT_PROP_REASON, PayloadBuilder().error(it.code.id.toString(), it.message).build())
      }
    })
  }
}
