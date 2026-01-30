package com.theoplayer.theolive

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.player.theolive.DistributionLoadStartEvent
import com.theoplayer.android.api.event.player.theolive.DistributionLoadedEvent
import com.theoplayer.android.api.event.player.theolive.DistributionOfflineEvent
import com.theoplayer.android.api.event.player.theolive.EndpointLoadedEvent
import com.theoplayer.android.api.event.player.theolive.IntentToFallbackEvent
import com.theoplayer.android.api.event.player.theolive.TheoLiveEventTypes
import com.theoplayer.android.api.player.theolive.TheoLive
import com.theoplayer.util.PayloadBuilder

private const val EVENT_PROP_TYPE = "type"
private const val EVENT_PROP_DISTRIBUTION_ID = "distributionId"
private const val EVENT_PROP_DISTRIBUTION = "distribution"
private const val EVENT_PROP_ENDPOINT = "endpoint"
private const val EVENT_PROP_REASON = "reason"

class THEOliveEventAdapter(private val theoLiveApi: TheoLive, private val emitter: Emitter) {

  interface Emitter {
    fun emit(payload: WritableMap?)
  }

  private val onDistributionLoadStart =
    EventListener<DistributionLoadStartEvent> { onDistributionLoadStart(it) }
  private val onDistributionLoaded =
    EventListener<DistributionLoadedEvent> { onDistributionLoaded(it) }
  private val onDistributionOffline =
    EventListener<DistributionOfflineEvent> { onDistributionOffline(it) }
  private val onEndPointLoaded =
    EventListener<EndpointLoadedEvent> { onEndPointLoaded(it) }
  private val onIntentOfFallback =
    EventListener<IntentToFallbackEvent> { onIntentOfFallback(it) }

  init {
    theoLiveApi.addEventListener(TheoLiveEventTypes.DISTRIBUTIONLOADSTART, onDistributionLoadStart)
    theoLiveApi.addEventListener(TheoLiveEventTypes.DISTRIBUTIONLOADED, onDistributionLoaded)
    theoLiveApi.addEventListener(TheoLiveEventTypes.DISTRIBUTIONOFFLINE, onDistributionOffline)
    theoLiveApi.addEventListener(TheoLiveEventTypes.ENDPOINTLOADED, onEndPointLoaded)
    theoLiveApi.addEventListener(TheoLiveEventTypes.INTENTTOFALLBACK, onIntentOfFallback)
  }

  fun destroy() {
    theoLiveApi.removeEventListener(
      TheoLiveEventTypes.DISTRIBUTIONLOADSTART,
      onDistributionLoadStart
    )
    theoLiveApi.removeEventListener(TheoLiveEventTypes.DISTRIBUTIONLOADED, onDistributionLoaded)
    theoLiveApi.removeEventListener(TheoLiveEventTypes.DISTRIBUTIONOFFLINE, onDistributionOffline)
    theoLiveApi.removeEventListener(TheoLiveEventTypes.ENDPOINTLOADED, onEndPointLoaded)
    theoLiveApi.removeEventListener(TheoLiveEventTypes.INTENTTOFALLBACK, onIntentOfFallback)
  }

  private fun onDistributionLoadStart(event: DistributionLoadStartEvent) {
    emitter.emit(Arguments.createMap().apply {
      putString(EVENT_PROP_TYPE, "distributionloadstart")
      putString(EVENT_PROP_DISTRIBUTION_ID, event.getDistributionId())
    })
  }

  private fun onDistributionLoaded(event: DistributionLoadedEvent) {
    emitter.emit(Arguments.createMap().apply {
      putString(EVENT_PROP_TYPE, "distributionloaded")
      putString(EVENT_PROP_DISTRIBUTION, event.getDistribution())
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
