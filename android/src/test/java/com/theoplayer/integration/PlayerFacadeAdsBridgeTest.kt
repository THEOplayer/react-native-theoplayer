package com.theoplayer.integration

import com.google.ads.interactivemedia.v3.api.AdError
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegration
import com.theoplayer.android.api.ads.ima.GoogleImaAdEvent
import com.theoplayer.android.api.ads.ima.GoogleImaAdEventType
import com.theoplayer.android.api.ads.ima.GoogleImaIntegration
import com.theoplayer.android.api.ads.wrapper.AdEventListener
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.ads.*
import com.theoplayer.android.api.event.player.DestroyEvent
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.source.GoogleDaiTypedSource
import com.theoplayer.android.api.source.SourceDescription
import com.theoplayer.android.api.source.ssai.dai.GoogleDaiVodConfiguration
import com.theoplayer.android.api.source.addescription.GoogleImaAdDescription
import org.junit.Assert.*
import org.junit.Test

class PlayerFacadeAdsBridgeTest {
  private val host = PlayerFacadeTestHost()
  private val facade = PlayerFacade(host.player)
  private val nativeApi = AdsApiWrapper()
  private val bridge = PlayerFacadeAdsBridge(nativeApi)
  private val received = mutableListOf<Pair<EventType<*>?, Any?>>()
  private val listener = object : AdEventListener {
    override fun <E : AdEvent<*>?> onAdEvent(type: EventType<E>?, ad: Ad?, adData: Map<String, String>?, adError: AdError?) {
      received.add(type to ad)
    }
    override fun <E : AdEvent<*>?> onAdBreakEvent(type: EventType<E>?, adBreak: AdBreak?, adData: Map<String, String>?, adError: AdError?) {
      received.add(type to adBreak)
    }
  }
  private val adBreak = facadeStub<AdBreak> { method, _ -> if (method == "getId") "break" else null }
  private val ad = facadeStub<Ad> { method, _ -> if (method == "getAdBreak") adBreak else null }

  private fun initialize(imaSource: Boolean = true) {
    bridge.initialize(facade, facadeStub<GoogleImaIntegration> { _, _ -> null }, null)
    nativeApi.addAllEventsListener(listener)
    nativeApi.addEventListener(AdsEventTypes.AD_CLICKED, listener)
    nativeApi.addEventListener(AdsEventTypes.AD_TAPPED, listener)
    bridge.setSource(if (imaSource) SourceDescription.Builder("test-content")
      .ads(GoogleImaAdDescription.Builder("test-ad-tag").build()).build() else null)
  }

  @Test fun genericIntegrationStateNeverEntersNativeImaCasts() {
    initialize()
    var state: PlayerFacadeAdState? = PlayerFacadeAdState(true, listOf(ad), adBreak)
    val registration = facade.registerIntegration(object : Integration { override fun getAdState() = state })
    assertEquals(listOf(ad), bridge.currentAds)
    assertSame(adBreak, bridge.currentAdBreak)
    assertTrue(bridge.isPlaying)
    assertEquals(emptyList<Ad>(), nativeApi.currentAds)
    state = state!!.copy(currentAdBreak = null)
    assertNull(bridge.currentAdBreak)
    state = null
    assertEquals(nativeApi.currentAds, bridge.currentAds)
    registration.close()
    assertEquals(nativeApi.currentAds, bridge.currentAds)
    bridge.destroy()
    facade.close()
  }

  @Test fun genericEventsAndClicksReachNativeSinkWithPlainAndImaSources() {
    for (ima in listOf(false, true)) {
      if (ima) initialize() else initialize(false)
      val registration = facade.registerIntegration(object : Integration {})
      registration.dispatchEvent(facadeEvent<AdBeginEvent>(AdsEventTypes.AD_BEGIN, ad))
      registration.dispatchEvent(facadeEvent<AdClickedEvent>(AdsEventTypes.AD_CLICKED, ad))
      registration.dispatchEvent(facadeEvent<AdTappedEvent>(AdsEventTypes.AD_TAPPED, ad))
      registration.dispatchEvent(facadeEvent<AdBreakBeginEvent>(AdsEventTypes.AD_BREAK_BEGIN, adBreak))
      assertEquals(listOf(AdsEventTypes.AD_BEGIN to ad, AdsEventTypes.AD_CLICKED to ad, AdsEventTypes.AD_TAPPED to ad, AdsEventTypes.AD_BREAK_BEGIN to adBreak), received)
      registration.close()
      bridge.destroy()
      nativeApi.removeAllEventsListener(listener)
      nativeApi.removeEventListener(AdsEventTypes.AD_CLICKED, listener)
      nativeApi.removeEventListener(AdsEventTypes.AD_TAPPED, listener)
      received.clear()
    }
    facade.close()
  }

  @Test fun nativeImaFilteringRunsOnceAndIntegrationImaEventsBypassIt() {
    initialize()
    var consume = true
    var decisions = 0
    var publicEvents = 0
    val registration = facade.registerIntegration(object : Integration {
      override fun shouldConsumeAdEvent(event: AdEvent<*>): Boolean { decisions++; return consume }
    })
    facade.ads.addEventListener(GoogleImaAdEventType.STARTED) { publicEvents++ }
    val event = facadeStub<GoogleImaAdEvent> { method, _ ->
      when (method) {
        "getType" -> GoogleImaAdEventType.STARTED
        "getAdData" -> emptyMap<String, String>()
        else -> null
      }
    }
    host.emitAd(event)
    assertEquals(1, decisions)
    assertTrue(received.isEmpty())
    assertEquals(0, publicEvents)
    consume = false
    host.emitAd(event)
    assertEquals(2, decisions)
    assertEquals(listOf(GoogleImaAdEventType.STARTED to null), received)
    registration.dispatchEvent(event)
    assertEquals(2, decisions)
    assertEquals(2, received.size)
    assertEquals(2, publicEvents)
    registration.close()
    host.emitAd(event)
    assertEquals(3, received.size)
    assertEquals(2, decisions)
    bridge.destroy()
    facade.close()
  }

  @Test fun nativeWrapperKeepsRawClockAndStateDespiteIntegrationOverrides() {
    initialize()
    val registration = facade.registerIntegration(object : Integration { override fun getCurrentTime() = 2.0 })
    val field = AdsApiWrapper::class.java.getDeclaredField("player").apply { isAccessible = true }
    val backing = field.get(nativeApi) as Player
    assertEquals(123.0, backing.currentTime, 0.0)
    assertEquals(2.0, facade.currentTime, 0.0)
    assertSame(host.ads.currentAds, backing.ads.currentAds)
    registration.close()
    bridge.destroy()
    facade.close()
  }

  @Test fun customAdsControlsSchedulesAndEventsReturnToNativeAfterClose() {
    initialize()
    val custom = PlayerFacadeTestHost()
    custom.scheduledAds.addAll(listOf(ad, ad))
    custom.currentAds = listOf(ad)
    custom.currentBreak = adBreak
    custom.playingAds = true
    val registration = facade.registerIntegration(object : Integration { override val ads = custom.ads })
    assertEquals(listOf(ad), bridge.currentAds)
    assertEquals(listOf(adBreak), bridge.scheduledAdBreaks)
    assertSame(adBreak, bridge.currentAdBreak)
    assertTrue(bridge.isPlaying)
    bridge.skip()
    bridge.schedule(GoogleImaAdDescription.Builder("test-ad-tag").build())
    assertEquals(listOf("skip", "schedule"), custom.commands)
    assertTrue(host.commands.isEmpty())
    custom.emitAd(facadeEvent<AdBeginEvent>(AdsEventTypes.AD_BEGIN, ad))
    assertEquals(listOf(AdsEventTypes.AD_BEGIN to ad), received)
    registration.close()
    assertTrue(custom.adListeners.values.all { it.isEmpty() })
    bridge.skip()
    assertEquals(listOf("skip"), host.commands)
    assertEquals(nativeApi.scheduledAdBreaks, bridge.scheduledAdBreaks)
    assertFalse(bridge.isPlaying)
    assertTrue(bridge.currentAds.isEmpty())
    bridge.destroy()
    assertTrue(host.adListeners.values.all { it.isEmpty() })
    facade.close()
  }

  @Test fun nestedSyntheticDispatchDoesNotChangeNativeEventOrigin() {
    initialize()
    val registration = facade.registerIntegration(object : Integration {})
    facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) {
      registration.dispatchEvent(facadeEvent<AdClickedEvent>(AdsEventTypes.AD_CLICKED, ad))
    }
    host.emitAd(facadeEvent<AdBeginEvent>(AdsEventTypes.AD_BEGIN, ad))
    assertEquals(listOf(AdsEventTypes.AD_CLICKED to ad), received)
    bridge.destroy()
    facade.close()
  }

  @Test fun bridgeWithoutFacadePreservesNativeWrapperBehavior() {
    bridge.initialize(host.player, null, null)
    bridge.setSource(null)
    host.currentAds = listOf(ad)
    assertEquals(nativeApi.currentAds, bridge.currentAds)
    assertEquals(nativeApi.currentAdBreak, bridge.currentAdBreak)
    assertEquals(nativeApi.scheduledAdBreaks, bridge.scheduledAdBreaks)
    bridge.skip()
    assertEquals(listOf("skip"), host.commands)
    bridge.destroy()
    facade.close()
  }

  @Test fun daiSourceKeepsNativeFallbackAndAcceptsGenericIntegrationEvents() {
    val dai = facadeStub<GoogleDaiIntegration> { method, _ -> if (method == "getCuePoints") emptyList<Any>() else null }
    bridge.initialize(facade, null, dai)
    nativeApi.addAllEventsListener(listener)
    val config = GoogleDaiVodConfiguration("google-dai", contentSourceID = "test-content", videoID = "test-video")
    bridge.setSource(SourceDescription.Builder(GoogleDaiTypedSource.Builder(config).build()).build())
    assertEquals(nativeApi.scheduledAdBreaks, bridge.scheduledAdBreaks)
    assertFalse(bridge.isPlaying)
    val registration = facade.registerIntegration(object : Integration {
      override fun getAdState() = PlayerFacadeAdState(true, listOf(ad), adBreak)
    })
    registration.dispatchEvent(facadeEvent<AdBeginEvent>(AdsEventTypes.AD_BEGIN, ad))
    assertEquals(listOf(AdsEventTypes.AD_BEGIN to ad), received)
    assertEquals(listOf(ad), bridge.currentAds)
    registration.close()
    assertEquals(nativeApi.currentAds, bridge.currentAds)
    assertEquals(nativeApi.scheduledAdBreaks, bridge.scheduledAdBreaks)
    bridge.destroy()
    facade.close()
  }

  @Test fun destroyingContentNotifiesFacadeBeforeClosingAndAlwaysCleansUp() {
    for (mode in listOf("event", "no-event", "throw", "listener-throws", "consumed")) {
      val content = PlayerFacadeTestHost()
      val player = PlayerFacade(content.player)
      val registration = player.registerIntegration(object : Integration {})
      var notified = 0
      player.addEventListener(PlayerEventTypes.DESTROY) {
        notified++
        if (mode == "listener-throws") throw IllegalStateException("listener failed")
      }
      if (mode == "consumed") registration.interceptPlayerEvents { true }
      val destroy = {
        player.destroyContent {
          if (mode == "throw") throw IllegalStateException("destroy failed")
          if (mode != "no-event") content.emitPlayer(facadeEvent<DestroyEvent>(PlayerEventTypes.DESTROY))
        }
      }
      if (mode == "throw" || mode == "listener-throws") assertThrows(IllegalStateException::class.java) { destroy() } else destroy()
      assertEquals(if (mode == "event" || mode == "listener-throws") 1 else 0, notified)
      assertThrows(IllegalStateException::class.java) { player.registerIntegration(object : Integration {}) }
      assertTrue(content.playerListeners.values.all { it.isEmpty() })
    }
    facade.close()
  }
}
