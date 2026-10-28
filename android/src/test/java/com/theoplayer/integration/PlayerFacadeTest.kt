package com.theoplayer.integration

import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.ads.*
import com.theoplayer.android.api.event.player.*
import com.theoplayer.android.api.source.addescription.GoogleImaAdDescription
import java.io.Closeable
import org.junit.Assert.*
import org.junit.Test

class PlayerFacadeTest {
  private val adBreak = facadeStub<AdBreak> { method, _ -> if (method == "getId") "break" else null }
  private val ad = facadeStub<Ad> { method, _ ->
    when (method) {
      "getId" -> "ad"
      "getType" -> "linear"
      "getAdBreak" -> adBreak
      else -> null
    }
  }
  private val adBegin = facadeEvent<AdBeginEvent>(AdsEventTypes.AD_BEGIN, ad)
  private val adEnd = facadeEvent<AdEndEvent>(AdsEventTypes.AD_END, ad)
  private val timeUpdate = facadeEvent<TimeUpdateEvent>(PlayerEventTypes.TIMEUPDATE)
  private val pause = facadeEvent<PauseEvent>(PlayerEventTypes.PAUSE)
  private val destroy = facadeEvent<DestroyEvent>(PlayerEventTypes.DESTROY)

  @Test fun optInLeavesOriginalPlayerUntouchedWhenDisabled() {
    val host = PlayerFacadeTestHost()
    assertSame(host.player, PlayerFacade.create(host.player, false))
    assertEquals(0, host.adsReads)
    assertTrue(host.adListeners.isEmpty())
    assertTrue(host.playerListeners.isEmpty())
    val facade = PlayerFacade.create(host.player, true) as PlayerFacade
    assertSame(host.player, facade.contentPlayer)
    facade.close()
  }

  @Test fun delegatesWithoutRegistrationAndKeepsStableAdsIdentity() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    host.playingAds = true
    host.currentAds = listOf(ad)
    host.currentBreak = adBreak
    assertEquals(123.0, facade.currentTime, 0.0)
    assertSame(facade.ads, facade.ads)
    assertEquals(listOf(ad), facade.ads.currentAds)
    assertSame(adBreak, facade.ads.currentAdBreak)
    assertTrue(facade.ads.isPlaying)
    var received: AdBeginEvent? = null
    facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) { received = it }
    host.emitAd(adBegin)
    assertSame(adBegin, received)
    facade.close()
    assertTrue(host.adListeners.values.all { it.isEmpty() })
    assertTrue(host.playerListeners.values.all { it.isEmpty() })
  }

  @Test fun defaultIntegrationDelegatesAllPlaybackOperationsAndNativeAdEvents() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    facade.registerIntegration(object : Integration {})
    assertEquals(123.0, facade.currentTime, 0.0)
    assertEquals(600.0, facade.duration, 0.0)
    assertTrue(facade.isPaused)
    assertFalse(facade.isSeeking)
    assertFalse(facade.isMuted)
    assertEquals(0.8, facade.volume, 0.0)
    facade.currentTime = 5.0
    facade.play()
    facade.pause()
    facade.isMuted = true
    facade.volume = 0.4
    facade.ads.skip()
    assertEquals(listOf("setCurrentTime", "play", "pause", "setMuted", "setVolume", "skip"), host.commands)
    var count = 0
    facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) { count++ }
    host.emitAd(adBegin)
    assertEquals(1, count)
    facade.close()
  }

  @Test fun invalidIntegrationTimeFallsBackToContent() {
    val facade = PlayerFacade(PlayerFacadeTestHost().player)
    var time: Double? = 7.5
    val source = facade.registerIntegration(object : Integration { override fun getCurrentTime() = time })
    assertEquals(7.5, facade.currentTime, 0.0)
    for (invalid in listOf(null, Double.NaN, Double.POSITIVE_INFINITY, -1.0)) {
      time = invalid
      assertEquals(123.0, facade.currentTime, 0.0)
    }
    time = 0.0
    assertEquals(0.0, facade.currentTime, 0.0)
    source.close()
    assertEquals(123.0, facade.currentTime, 0.0)
    facade.close()
  }

  @Test fun integrationOverridesPlaybackSeekingAndAudioWithNullAndFalseFallbacks() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    val integration = object : Integration {
      var active = true
      var time = 7.5
      var paused = false
      var muted = true
      var volume = 0.3
      var duration = Double.POSITIVE_INFINITY
      override fun getCurrentTime(): Double? = if (active) time else null
      override fun getDuration(): Double? = if (active) duration else null
      override fun isPaused(): Boolean? = if (active) paused else null
      override fun isSeeking(): Boolean? = if (active) true else null
      override fun getMuted(): Boolean? = if (active) muted else null
      override fun getVolume(): Double? = if (active) volume else null
      override fun setCurrentTime(currentTime: Double): Boolean { if (active) time = currentTime; return active }
      override fun play(): Boolean { if (active) paused = false; return active }
      override fun pause(): Boolean { if (active) paused = true; return active }
      override fun setMuted(muted: Boolean): Boolean { if (active) this.muted = muted; return active }
      override fun setVolume(volume: Double): Boolean { if (active) this.volume = volume; return active }
    }
    val registration = facade.registerIntegration(integration)
    assertEquals(7.5, facade.currentTime, 0.0)
    assertEquals(Double.POSITIVE_INFINITY, facade.duration, 0.0)
    integration.duration = Double.NaN
    assertTrue(facade.duration.isNaN())
    assertFalse(facade.isPaused)
    assertTrue(facade.isSeeking)
    assertTrue(facade.isMuted)
    assertEquals(0.3, facade.volume, 0.0)
    facade.currentTime = 12.0
    facade.pause()
    assertTrue(facade.isPaused)
    facade.play()
    assertFalse(facade.isPaused)
    facade.isMuted = false
    facade.volume = 0.4
    assertEquals(12.0, integration.time, 0.0)
    assertFalse(integration.muted)
    assertEquals(0.4, integration.volume, 0.0)
    assertTrue(host.commands.isEmpty())
    integration.active = false
    assertEquals(123.0, facade.currentTime, 0.0)
    assertEquals(600.0, facade.duration, 0.0)
    assertTrue(facade.isPaused)
    assertFalse(facade.isSeeking)
    assertFalse(facade.isMuted)
    assertEquals(0.8, facade.volume, 0.0)
    facade.currentTime = 50.0
    facade.play()
    facade.pause()
    facade.isMuted = true
    facade.volume = 0.6
    assertEquals(listOf("setCurrentTime", "play", "pause", "setMuted", "setVolume"), host.commands)
    integration.active = true
    registration.close()
    assertEquals(50.0, facade.currentTime, 0.0)
    assertFalse(facade.isSeeking)
    assertTrue(facade.isMuted)
    assertEquals(0.6, facade.volume, 0.0)
    facade.close()
  }

  @Test fun integrationOwnsAdStateAndDispatchNeverReconstructsLifecycle() {
    val host = PlayerFacadeTestHost()
    host.currentBreak = adBreak
    val facade = PlayerFacade(host.player)
    var state: PlayerFacadeAdState? = PlayerFacadeAdState(false, emptyList(), null)
    val registration = facade.registerIntegration(object : Integration { override fun getAdState() = state })
    assertNull(facade.ads.currentAdBreak)
    registration.dispatchEvent(adBegin)
    assertFalse(facade.ads.isPlaying)
    assertTrue(facade.ads.currentAds.isEmpty())
    state = PlayerFacadeAdState(true, listOf(ad), adBreak)
    for (event in listOf(adEnd, facadeEvent<AdSkipEvent>(AdsEventTypes.AD_SKIP, ad), facadeEvent<AdBreakEndEvent>(AdsEventTypes.AD_BREAK_END, adBreak))) {
      registration.dispatchEvent(event)
      assertTrue(facade.ads.isPlaying)
      assertEquals(listOf(ad), facade.ads.currentAds)
      assertSame(adBreak, facade.ads.currentAdBreak)
    }
    state = null
    assertFalse(facade.ads.isPlaying)
    assertSame(adBreak, facade.ads.currentAdBreak)
    facade.close()
  }

  @Test fun stableAdsDelegatesControlsAndMigratesExistingListeners() {
    val host = PlayerFacadeTestHost()
    val integrated = PlayerFacadeTestHost()
    integrated.playingAds = true
    integrated.currentAds = listOf(ad)
    integrated.scheduledAds.add(ad)
    val facade = PlayerFacade(host.player)
    val ads = facade.ads
    var count = 0
    val listener = EventListener<AdBeginEvent> { count++ }
    ads.addEventListener(AdsEventTypes.AD_BEGIN, listener)
    ads.addEventListener(AdsEventTypes.AD_BEGIN, listener)
    @Suppress("UNCHECKED_CAST")
    val queuedNative = host.adListeners[AdsEventTypes.AD_BEGIN]!!.single() as EventListener<AdBeginEvent>
    val source = facade.registerIntegration(object : Integration {
      override val ads = integrated.ads
      override fun getAdState() = PlayerFacadeAdState(false, emptyList(), adBreak)
      override fun shouldConsumeAdEvent(event: AdEvent<*>) = true
    })
    assertSame(ads, facade.ads)
    assertTrue(ads.isPlaying)
    assertEquals(listOf(ad), ads.currentAds)
    assertNull(ads.currentAdBreak)
    assertSame(integrated.scheduledAds, ads.scheduledAds)
    assertTrue(host.adListeners.values.all { it.isEmpty() })
    queuedNative.handleEvent(adBegin)
    assertEquals(0, count)
    ads.skip()
    ads.schedule(GoogleImaAdDescription.Builder("test-ad-tag").build())
    assertEquals(listOf("skip", "schedule"), integrated.commands)
    assertTrue(host.commands.isEmpty())
    integrated.emitAd(adBegin)
    assertEquals(1, count)
    @Suppress("UNCHECKED_CAST")
    val queuedIntegration = integrated.adListeners[AdsEventTypes.AD_BEGIN]!!.single() as EventListener<AdBeginEvent>
    source.close()
    assertTrue(integrated.adListeners.values.all { it.isEmpty() })
    queuedIntegration.handleEvent(adBegin)
    assertEquals(1, count)
    assertFalse(ads.isPlaying)
    ads.skip()
    assertEquals(listOf("skip"), host.commands)
    host.emitAd(adBegin)
    assertEquals(2, count)
    ads.removeEventListener(AdsEventTypes.AD_BEGIN, listener)
    host.emitAd(adBegin)
    assertEquals(2, count)
    facade.close()
  }

  @Test fun nativeAdFilteringDecidesOnceForAllListenersAndSyntheticEventsBypassIt() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    var decisions = 0
    var count = 0
    val registration = facade.registerIntegration(object : Integration {
      override fun shouldConsumeAdEvent(event: AdEvent<*>) = ++decisions == 1
    })
    facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) { count++ }
    facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) { count++ }
    host.emitAd(adBegin)
    assertEquals(0, count)
    assertEquals(1, decisions)
    host.emitAd(adBegin)
    assertEquals(2, count)
    registration.dispatchEvent(adBegin)
    assertEquals(4, count)
    assertEquals(2, decisions)
    facade.close()
  }

  @Test fun registrationDuringNativeAdsIsAllowedButConcurrentIntegrationsAreRejected() {
    val host = PlayerFacadeTestHost()
    host.playingAds = true
    host.currentBreak = adBreak
    val facade = PlayerFacade(host.player)
    val source = facade.registerIntegration(object : Integration {})
    assertTrue(facade.ads.isPlaying)
    assertThrows(IllegalStateException::class.java) { facade.registerIntegration(object : Integration {}) }
    source.close()
    facade.registerIntegration(object : Integration {})
    facade.close()
    assertThrows(IllegalStateException::class.java) { facade.registerIntegration(object : Integration {}) }
  }

  @Test fun failedRegistrationRestoresAllNativeAdsSubscriptions() {
    val host = PlayerFacadeTestHost()
    val integrated = PlayerFacadeTestHost()
    integrated.failAdSubscription = AdsEventTypes.AD_END
    val facade = PlayerFacade(host.player)
    var count = 0
    facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) { count++ }
    facade.ads.addEventListener(AdsEventTypes.AD_END) { count++ }
    assertThrows(IllegalStateException::class.java) { facade.registerIntegration(object : Integration { override val ads = integrated.ads }) }
    assertTrue(integrated.adListeners.values.all { it.isEmpty() })
    host.emitAd(adBegin)
    host.emitAd(adEnd)
    assertEquals(2, count)
    facade.registerIntegration(object : Integration {})
    facade.close()
  }

  @Test fun typedInterceptionDecidesOnceForAllConsumersButLeavesRawEventsUntouched() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    val registration = facade.registerIntegration(object : Integration {})
    var decisions = 0
    var raw = 0
    var visible = 0
    host.player.addEventListener(PlayerEventTypes.TIMEUPDATE) { raw++ }
    facade.addEventListener(PlayerEventTypes.TIMEUPDATE) { visible++ }
    facade.addEventListener(PlayerEventTypes.TIMEUPDATE) { visible++ }
    val remove = registration.interceptPlayerEvent(PlayerEventTypes.TIMEUPDATE) { decisions++; true }
    host.emitPlayer(timeUpdate)
    assertEquals(1, raw)
    assertEquals(0, visible)
    assertEquals(1, decisions)
    registration.dispatchEvent(timeUpdate)
    assertEquals(2, visible)
    assertEquals(1, raw)
    remove.close()
    remove.close()
    host.emitPlayer(timeUpdate)
    assertEquals(2, raw)
    assertEquals(4, visible)
    assertEquals(1, decisions)
    facade.close()
  }

  @Test fun typeSpecificInterceptorsObserveEventsWithoutConsumersAndDetachExplicitly() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    val registration = facade.registerIntegration(object : Integration {})
    var decisions = 0
    val remove = registration.interceptPlayerEvent(PlayerEventTypes.PAUSE) { decisions++; false }
    host.emitPlayer(pause)
    assertEquals(1, decisions)
    remove.close()
    assertTrue(host.playerListeners[PlayerEventTypes.PAUSE]!!.isEmpty())
    host.emitPlayer(pause)
    assertEquals(1, decisions)
    facade.close()
  }

  @Test fun catchAllInterceptionCoversFutureSubscriptionsAfterSpecificInterceptors() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    val registration = facade.registerIntegration(object : Integration {})
    val seen = mutableListOf<String>()
    var removeLater = Closeable {}
    registration.interceptPlayerEvent(PlayerEventTypes.TIMEUPDATE) { seen.add("specific"); false }
    val remove = registration.interceptPlayerEvents { seen.add("all"); removeLater.close(); true }
    removeLater = registration.interceptPlayerEvents { seen.add("removed"); false }
    facade.addEventListener(PlayerEventTypes.TIMEUPDATE) { seen.add("time") }
    facade.addEventListener(PlayerEventTypes.PAUSE) { seen.add("pause") }
    host.emitPlayer(timeUpdate)
    host.emitPlayer(pause)
    assertEquals(listOf("specific", "all", "all"), seen)
    registration.dispatchEvent(pause)
    assertEquals("pause", seen.last())
    registration.close()
    host.emitPlayer(pause)
    assertEquals("all", seen.last())
    remove.close()
    host.emitPlayer(pause)
    assertEquals("pause", seen.last())
    facade.close()
  }

  @Test fun queuedEventsCanDrainAfterUnregisteringWithoutConsumingLaterUserEvents() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    val registration = facade.registerIntegration(object : Integration {})
    var pending = true
    var visible = 0
    facade.addEventListener(PlayerEventTypes.PAUSE) { visible++ }
    var remove = Closeable {}
    remove = registration.interceptPlayerEvent(PlayerEventTypes.PAUSE) {
      val consumed = pending
      pending = false
      remove.close()
      consumed
    }
    registration.close()
    registration.interceptPlayerEvent(PlayerEventTypes.PAUSE) { fail("closed registration installed interceptor"); true }
    registration.interceptPlayerEvents { fail("closed registration installed catch-all interceptor"); true }
    host.emitPlayer(pause)
    assertEquals(0, visible)
    host.emitPlayer(pause)
    assertEquals(1, visible)
    facade.close()
  }

  @Test fun playerAndAdvertisingEventsUseSeparateSurfacesAndPreserveNativePayloads() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    val registration = facade.registerIntegration(object : Integration { override fun getCurrentTime() = 7.5 })
    val players = mutableListOf<PlayerEvent<*>>()
    val ads = mutableListOf<AdEvent<*>>()
    var raw = 0
    host.player.addEventListener(PlayerEventTypes.TIMEUPDATE) { raw++ }
    facade.addEventListener(PlayerEventTypes.TIMEUPDATE) { players.add(it) }
    facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) { ads.add(it) }
    facade.ads.addEventListener(AdsEventTypes.AD_CLICKED) { ads.add(it) }
    host.emitPlayer(timeUpdate)
    assertSame(timeUpdate, players.single())
    assertEquals(123.0, (players.single() as TimeUpdateEvent).currentTime, 0.0)
    assertEquals(7.5, facade.currentTime, 0.0)
    registration.dispatchPlayerEvent(timeUpdate)
    registration.dispatchEvent(timeUpdate)
    assertEquals(3, players.size)
    assertEquals(1, raw)
    registration.dispatchEvent(adBegin)
    val clicked = facadeEvent<AdClickedEvent>(AdsEventTypes.AD_CLICKED, ad)
    registration.dispatchEvent(clicked)
    assertEquals(listOf(adBegin, clicked), ads)
    assertEquals(3, players.size)
    facade.close()
  }

  @Test fun staleRegistrationCannotEmitOrCloseReplacement() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    val old = facade.registerIntegration(object : Integration {})
    var count = 0
    facade.addEventListener(PlayerEventTypes.TIMEUPDATE) { count++ }
    facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) { count++ }
    old.close()
    val current = facade.registerIntegration(object : Integration { override fun getCurrentTime() = 2.0 })
    old.dispatchEvent(adBegin)
    old.dispatchEvent(timeUpdate)
    old.close()
    assertEquals(0, count)
    assertEquals(2.0, facade.currentTime, 0.0)
    current.dispatchEvent(adBegin)
    current.dispatchPlayerEvent(timeUpdate)
    assertEquals(2, count)
    facade.close()
    current.dispatchEvent(adBegin)
    current.dispatchEvent(timeUpdate)
    current.close()
    facade.close()
    assertEquals(2, count)
  }

  @Test fun dispatchHonorsListenerRemovalUnregisterAndCloseDuringDelivery() {
    for (native in listOf(false, true)) for (isAd in listOf(false, true)) for (action in listOf("remove", "unregister", "close")) {
      val host = PlayerFacadeTestHost()
      val facade = PlayerFacade(host.player)
      val registration = facade.registerIntegration(object : Integration {})
      val seen = mutableListOf<String>()
      val adSecond = EventListener<AdBeginEvent> { seen.add("second") }
      val playerSecond = EventListener<TimeUpdateEvent> { seen.add("second") }
      val first = {
        seen.add("first")
        when (action) {
          "remove" -> if (isAd) facade.ads.removeEventListener(AdsEventTypes.AD_BEGIN, adSecond) else facade.removeEventListener(PlayerEventTypes.TIMEUPDATE, playerSecond)
          "unregister" -> registration.close()
          else -> facade.close()
        }
      }
      if (isAd) {
        facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) { first() }
        facade.ads.addEventListener(AdsEventTypes.AD_BEGIN, adSecond)
        if (native) host.emitAd(adBegin) else registration.dispatchEvent(adBegin)
      } else {
        facade.addEventListener(PlayerEventTypes.TIMEUPDATE) { first() }
        facade.addEventListener(PlayerEventTypes.TIMEUPDATE, playerSecond)
        if (native) host.emitPlayer(timeUpdate) else registration.dispatchEvent(timeUpdate)
      }
      val expected = if (native && !isAd && action == "unregister") listOf("first", "second") else listOf("first")
      assertEquals("native=$native, isAd=$isAd, action=$action", expected, seen)
      facade.close()
    }
  }

  @Test fun nativeDestructionAlwaysClosesFacadeEvenWhenConsumedOrListenerThrows() {
    for (mode in listOf("forward", "consume", "throw")) {
      val host = PlayerFacadeTestHost()
      val facade = PlayerFacade(host.player)
      val registration = facade.registerIntegration(object : Integration {})
      var count = 0
      facade.addEventListener(PlayerEventTypes.DESTROY) {
        count++
        if (mode == "throw") throw IllegalStateException("listener failed")
      }
      facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) {}
      registration.interceptPlayerEvents { mode == "consume" }
      if (mode == "throw") assertThrows(IllegalStateException::class.java) { host.emitPlayer(destroy) } else host.emitPlayer(destroy)
      assertEquals(if (mode == "consume") 0 else 1, count)
      assertTrue(host.playerListeners.values.all { it.isEmpty() })
      assertTrue(host.adListeners.values.all { it.isEmpty() })
      assertThrows(IllegalStateException::class.java) { facade.registerIntegration(object : Integration {}) }
      assertThrows(IllegalStateException::class.java) { facade.addEventListener(PlayerEventTypes.PAUSE) {} }
      assertThrows(IllegalStateException::class.java) { facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) {} }
    }
  }

  @Test fun listenerDeduplicationRemovalAndQueuedDeliveryAfterCloseAreSafe() {
    val host = PlayerFacadeTestHost()
    val facade = PlayerFacade(host.player)
    var count = 0
    val listener = EventListener<TimeUpdateEvent> { count++ }
    facade.addEventListener(PlayerEventTypes.TIMEUPDATE, listener)
    facade.addEventListener(PlayerEventTypes.TIMEUPDATE, listener)
    host.emitPlayer(timeUpdate)
    assertEquals(1, count)
    @Suppress("UNCHECKED_CAST")
    val queued = host.playerListeners[PlayerEventTypes.TIMEUPDATE]!!.single() as EventListener<TimeUpdateEvent>
    facade.removeEventListener(PlayerEventTypes.TIMEUPDATE, listener)
    queued.handleEvent(timeUpdate)
    assertEquals(1, count)
    facade.addEventListener(PlayerEventTypes.TIMEUPDATE, listener)
    queued.handleEvent(timeUpdate)
    assertEquals(1, count)
    facade.close()
    queued.handleEvent(timeUpdate)
    assertEquals(1, count)
    assertTrue(host.playerListeners.values.all { it.isEmpty() })
  }
}
