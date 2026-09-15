package com.theoplayer

import com.facebook.react.bridge.JavaOnlyMap
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.Ads
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.ads.*
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.android.api.event.player.TimeUpdateEvent
import com.theoplayer.android.api.player.Player
import org.junit.Assert.*
import org.junit.Test
import java.lang.reflect.Proxy
import java.util.Date

class PlayerFacadeTest {
  private class Host {
    val adListeners = mutableMapOf<EventType<*>, MutableSet<EventListener<*>>>()
    val playerListeners = mutableMapOf<EventType<*>, MutableSet<EventListener<*>>>()
    var currentTime = 123.0
    var adsReads = 0
    var currentAd: Ad? = null
    var currentBreak: AdBreak? = null
    val commands = mutableListOf<String>()
    val ads = stub<Ads> { method, args ->
      when (method) {
        "isPlaying" -> currentAd != null
        "getCurrentAds" -> listOfNotNull(currentAd)
        "getCurrentAdBreak" -> currentBreak
        "addEventListener" -> add(adListeners, args)
        "removeEventListener" -> remove(adListeners, args)
        "skip" -> { commands.add(method); null }
        else -> null
      }
    }
    val player = stub<Player> { method, args ->
      when (method) {
        "getAds" -> { adsReads++; ads }
        "getCurrentTime" -> currentTime
        "getDuration" -> 600.0
        "isPaused" -> true
        "addEventListener" -> add(playerListeners, args)
        "removeEventListener" -> remove(playerListeners, args)
        "play", "pause", "setCurrentTime" -> { commands.add(method); null }
        else -> null
      }
    }

    private fun add(listeners: MutableMap<EventType<*>, MutableSet<EventListener<*>>>, args: Array<out Any?>?): Any? {
      listeners.getOrPut(args!![0] as EventType<*>) { linkedSetOf() }.add(args[1] as EventListener<*>)
      return null
    }

    private fun remove(listeners: MutableMap<EventType<*>, MutableSet<EventListener<*>>>, args: Array<out Any?>?): Any? {
      listeners[args!![0]]?.remove(args[1])
      return null
    }

    fun emit(event: AdEvent<*>) {
      adListeners[event.type]?.toList()?.forEach {
        @Suppress("UNCHECKED_CAST")
        (it as EventListener<AdEvent<*>>).handleEvent(event)
      }
    }
  }

  private val adBreak = stub<AdBreak> { method, _ -> if (method == "getId") "break" else null }
  private val ad = stub<Ad> { method, _ ->
    when (method) {
      "getId" -> "ad"
      "getType" -> "linear"
      "getAdBreak" -> adBreak
      else -> null
    }
  }
  private val breakBegin = event<AdBreakBeginEvent>(AdsEventTypes.AD_BREAK_BEGIN, adBreak)
  private val adBegin = event<AdBeginEvent>(AdsEventTypes.AD_BEGIN, ad)
  private val adEnd = event<AdEndEvent>(AdsEventTypes.AD_END, ad)
  private val breakEnd = event<AdBreakEndEvent>(AdsEventTypes.AD_BREAK_END, adBreak)

  @Test fun facadeOptInDefaultsOffAndLeavesOriginalPlayerUntouched() {
    for (props in listOf(null, JavaOnlyMap(), JavaOnlyMap.of("usePlayerFacade", false), JavaOnlyMap.of("usePlayerFacade", null))) {
      val host = Host()
      val enabled = PlayerConfigAdapter(props).usePlayerFacade()
      assertFalse(enabled)
      val player = PlayerFacade.create(host.player, enabled)
      assertSame(host.player, player)
      assertEquals(0, host.adsReads)
      assertTrue(host.adListeners.isEmpty())
      assertTrue(host.playerListeners.isEmpty())
      assertFalse(player is PlayerFacade)
    }
  }

  @Test fun optInCreatesFacadeBeforeRegistrationAndKeepsCachedReferencesWorking() {
    val host = Host()
    val enabled = PlayerConfigAdapter(JavaOnlyMap.of("usePlayerFacade", true)).usePlayerFacade()
    assertTrue(enabled)
    val player = PlayerFacade.create(host.player, enabled)
    assertTrue(player is PlayerFacade)
    assertNotSame(host.player, player)
    val ads = player.ads
    var received: AdBeginEvent? = null
    ads.addEventListener(AdsEventTypes.AD_BEGIN) { received = it }
    assertEquals(123.0, player.currentTime, 0.0)
    val source = (player as PlayerFacade).registerIntegration(clock { 7.5 })
    source.dispatchEvent(adBegin)
    assertSame(adBegin, received)
    assertEquals(7.5, player.currentTime, 0.0)
    assertTrue(ads.isPlaying)
    source.close()
    assertSame(ads, player.ads)
    assertEquals(123.0, player.currentTime, 0.0)
    assertFalse(ads.isPlaying)
    player.close()
  }

  @Test fun delegatesWithoutRegistrationAndKeepsStableAdsIdentity() {
    val host = Host()
    val facade = PlayerFacade(host.player)
    host.currentAd = ad
    host.currentBreak = adBreak
    assertEquals(123.0, facade.currentTime, 0.0)
    assertSame(facade.ads, facade.ads)
    assertEquals(listOf(ad), facade.ads.currentAds)
    assertSame(adBreak, facade.ads.currentAdBreak)
    assertTrue(facade.ads.isPlaying)
    var received: AdBeginEvent? = null
    facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) { received = it }
    host.emit(adBegin)
    assertSame(adBegin, received)
    facade.close()
    assertTrue(host.adListeners.values.all { it.isEmpty() })
  }

  @Test fun overridesOnlyTimeGetterAndRestoresNativeTimeOnClose() {
    val host = Host()
    val facade = PlayerFacade(host.player)
    var time: Double? = 7.5
    var updates = 0
    facade.addEventListener(PlayerEventTypes.TIMEUPDATE, EventListener<TimeUpdateEvent> { updates++ })
    val source = facade.registerIntegration(clock { time })
    assertEquals(7.5, facade.currentTime, 0.0)
    time = 9.0
    assertEquals(9.0, facade.currentTime, 0.0)
    time = null
    assertEquals(123.0, facade.currentTime, 0.0)
    assertEquals(600.0, facade.duration, 0.0)
    assertTrue(facade.isPaused)
    facade.play()
    facade.pause()
    facade.currentTime = 50.0
    facade.ads.skip()
    assertEquals(listOf("play", "pause", "setCurrentTime", "skip"), host.commands)
    assertEquals(0, updates)
    source.close()
    assertEquals(123.0, facade.currentTime, 0.0)
    facade.close()
  }

  @Test fun invalidAdTimeFallsBackToContent() {
    val facade = PlayerFacade(Host().player)
    var time = Double.NaN
    val source = facade.registerIntegration(clock { time })
    for (invalid in listOf(Double.NaN, Double.POSITIVE_INFINITY, -1.0)) {
      time = invalid
      assertEquals(123.0, facade.currentTime, 0.0)
    }
    time = 0.0
    assertEquals(0.0, facade.currentTime, 0.0)
    source.close()
    facade.close()
  }

  @Test fun injectedLifecycleUpdatesStateBeforeBeginAndClearsAfterEndCallbacks() {
    val facade = PlayerFacade(Host().player)
    val source = facade.registerIntegration(clock { 7.5 })
    val seen = mutableListOf<String>()
    facade.ads.addEventListener(AdsEventTypes.AD_BREAK_BEGIN) {
      assertSame(adBreak, facade.ads.currentAdBreak)
      assertFalse(facade.ads.isPlaying)
      seen.add("break-begin")
    }
    facade.ads.addEventListener(AdsEventTypes.AD_BEGIN) {
      assertSame(ad, facade.ads.currentAds.single())
      assertTrue(facade.ads.isPlaying)
      seen.add("ad-begin")
    }
    facade.ads.addEventListener(AdsEventTypes.AD_END) {
      assertSame(ad, facade.ads.currentAds.single())
      assertEquals(7.5, facade.currentTime, 0.0)
      seen.add("ad-end")
    }
    facade.ads.addEventListener(AdsEventTypes.AD_BREAK_END) {
      assertSame(adBreak, facade.ads.currentAdBreak)
      seen.add("break-end")
    }
    source.dispatchEvent(breakBegin)
    source.dispatchEvent(adBegin)
    source.dispatchEvent(adEnd)
    assertFalse(facade.ads.isPlaying)
    assertTrue(facade.ads.currentAds.isEmpty())
    assertSame(adBreak, facade.ads.currentAdBreak)
    source.dispatchEvent(breakEnd)
    assertNull(facade.ads.currentAdBreak)
    assertEquals(listOf("break-begin", "ad-begin", "ad-end", "break-end"), seen)
    facade.close()
  }

  @Test fun relaysQuartilesAndErrorsWithoutInventingCompletion() {
    val facade = PlayerFacade(Host().player)
    val source = facade.registerIntegration(clock { null })
    source.dispatchEvent(breakBegin)
    source.dispatchEvent(adBegin)
    var quartiles = 0
    var errors = 0
    facade.ads.addEventListener(AdsEventTypes.AD_FIRST_QUARTILE) { quartiles++ }
    facade.ads.addEventListener(AdsEventTypes.AD_ERROR) { errors++ }
    source.dispatchEvent(event<AdFirstQuartileEvent>(AdsEventTypes.AD_FIRST_QUARTILE, ad))
    source.dispatchEvent(event<AdErrorEvent>(AdsEventTypes.AD_ERROR, ad))
    assertEquals(1, quartiles)
    assertEquals(1, errors)
    assertTrue(facade.ads.isPlaying)
    source.dispatchEvent(event<AdSkipEvent>(AdsEventTypes.AD_SKIP, ad))
    assertFalse(facade.ads.isPlaying)
    assertSame(adBreak, facade.ads.currentAdBreak)
    facade.close()
  }

  @Test fun nonLinearAdDoesNotReportLinearPlayback() {
    val facade = PlayerFacade(Host().player)
    val source = facade.registerIntegration(clock { null })
    val image = stub<Ad> { method, _ ->
      when (method) {
        "getType" -> "nonlinear"
        "getAdBreak" -> adBreak
        else -> null
      }
    }
    source.dispatchEvent(breakBegin)
    source.dispatchEvent(event<AdBeginEvent>(AdsEventTypes.AD_BEGIN, image))
    assertEquals(listOf(image), facade.ads.currentAds)
    assertFalse(facade.ads.isPlaying)
    facade.close()
  }

  @Test fun registrationOwnsAdEventsAndRejectsConcurrentSources() {
    val host = Host()
    val facade = PlayerFacade(host.player)
    val ads = facade.ads
    var count = 0
    val listener = EventListener<AdBeginEvent> { count++ }
    ads.addEventListener(AdsEventTypes.AD_BEGIN, listener)
    ads.addEventListener(AdsEventTypes.AD_BEGIN, listener)
    val source = facade.registerIntegration(clock { 2.0 })
    assertThrows(IllegalStateException::class.java) { facade.registerIntegration(clock { 3.0 }) }
    host.emit(adBegin)
    assertEquals(0, count)
    source.dispatchEvent(adBegin)
    assertEquals(1, count)
    source.close()
    host.emit(adBegin)
    assertEquals(2, count)
    ads.removeEventListener(AdsEventTypes.AD_BEGIN, listener)
    host.emit(adBegin)
    assertEquals(2, count)
    assertSame(ads, facade.ads)
    assertTrue(host.adListeners.values.all { it.isEmpty() })
    facade.close()
  }

  @Test fun rejectsRegistrationDuringNativeAds() {
    val host = Host()
    val facade = PlayerFacade(host.player)
    host.currentBreak = adBreak
    assertThrows(IllegalStateException::class.java) { facade.registerIntegration(clock { null }) }
    host.currentBreak = null
    host.currentAd = ad
    assertThrows(IllegalStateException::class.java) { facade.registerIntegration(clock { null }) }
    facade.close()
  }

  @Test fun staleRegistrationCannotEmitOrCloseNewSource() {
    val facade = PlayerFacade(Host().player)
    val old = facade.registerIntegration(clock { 1.0 })
    old.dispatchEvent(adBegin)
    old.close()
    assertTrue(facade.ads.currentAds.isEmpty())
    val current = facade.registerIntegration(clock { 2.0 })
    old.dispatchEvent(adBegin)
    old.close()
    assertTrue(facade.ads.currentAds.isEmpty())
    assertEquals(2.0, facade.currentTime, 0.0)
    current.dispatchEvent(adBegin)
    assertTrue(facade.ads.isPlaying)
    facade.close()
    current.dispatchEvent(adBegin)
    current.close()
    facade.close()
    assertEquals(123.0, facade.currentTime, 0.0)
    assertThrows(IllegalStateException::class.java) { facade.registerIntegration(clock { null }) }
  }

  @Test fun reentrantBeginDuringEndCallbackIsNotCleared() {
    val facade = PlayerFacade(Host().player)
    val source = facade.registerIntegration(clock { null })
    source.dispatchEvent(adBegin)
    facade.ads.addEventListener(AdsEventTypes.AD_END) { source.dispatchEvent(adBegin) }
    source.dispatchEvent(adEnd)
    assertTrue(facade.ads.isPlaying)
    facade.close()
  }

  @Test fun reentrantQuartileDuringEndCallbackDoesNotPreventCleanup() {
    val facade = PlayerFacade(Host().player)
    val source = facade.registerIntegration(clock { null })
    source.dispatchEvent(adBegin)
    facade.ads.addEventListener(AdsEventTypes.AD_END) {
      source.dispatchEvent(event<AdFirstQuartileEvent>(AdsEventTypes.AD_FIRST_QUARTILE, ad))
    }
    source.dispatchEvent(adEnd)
    assertFalse(facade.ads.isPlaying)
    facade.close()
  }

  @Test fun contentTimeEventsRemainUnchangedDuringExternalAds() {
    val host = Host()
    val facade = PlayerFacade(host.player)
    val source = facade.registerIntegration(clock { 7.5 })
    source.dispatchEvent(adBegin)
    val contentEvent = stub<TimeUpdateEvent> { method, _ ->
      when (method) {
        "getCurrentTime" -> 123.0
        "getType" -> PlayerEventTypes.TIMEUPDATE
        else -> null
      }
    }
    var received: TimeUpdateEvent? = null
    val listener = EventListener<TimeUpdateEvent> { received = it }
    facade.addEventListener(PlayerEventTypes.TIMEUPDATE, listener)
    host.playerListeners[PlayerEventTypes.TIMEUPDATE].orEmpty().forEach {
      @Suppress("UNCHECKED_CAST")
      (it as EventListener<TimeUpdateEvent>).handleEvent(contentEvent)
    }
    assertSame(contentEvent, received)
    assertEquals(123.0, received!!.currentTime, 0.0)
    assertEquals(7.5, facade.currentTime, 0.0)
    facade.removeEventListener(PlayerEventTypes.TIMEUPDATE, listener)
    assertTrue(host.playerListeners.values.all { it.isEmpty() })
    facade.close()
  }

  @Test fun endStateClearsEvenWhenListenerThrows() {
    val facade = PlayerFacade(Host().player)
    val source = facade.registerIntegration(clock { null })
    source.dispatchEvent(adBegin)
    facade.ads.addEventListener(AdsEventTypes.AD_BREAK_END) { throw IllegalStateException("listener failed") }
    assertThrows(IllegalStateException::class.java) { source.dispatchEvent(breakEnd) }
    assertFalse(facade.ads.isPlaying)
    assertNull(facade.ads.currentAdBreak)
    facade.close()
  }

  @Test fun integrationOverridesGettersAndConsumesCommands() {
    val host = Host()
    val facade = PlayerFacade(host.player)
    val integration = object : Integration {
      var time = 7.5
      var paused = false
      var active = true
      override fun getCurrentTime(): Double? = if (active) time else null
      override fun setCurrentTime(currentTime: Double): Boolean {
        if (!active) return false
        time = currentTime
        return true
      }
      override fun getDuration(): Double? = if (active) 30.0 else null
      override fun isPaused(): Boolean? = if (active) paused else null
      override fun play(): Boolean {
        if (!active) return false
        paused = false
        return true
      }
      override fun pause(): Boolean {
        if (!active) return false
        paused = true
        return true
      }
    }
    val registration = facade.registerIntegration(integration)
    assertEquals(7.5, facade.currentTime, 0.0)
    assertEquals(30.0, facade.duration, 0.0)
    assertFalse(facade.isPaused)
    facade.currentTime = 12.0
    assertEquals(12.0, integration.time, 0.0)
    facade.pause()
    assertTrue(facade.isPaused)
    facade.play()
    assertFalse(facade.isPaused)
    assertTrue(host.commands.isEmpty())
    integration.active = false
    assertEquals(123.0, facade.currentTime, 0.0)
    assertEquals(600.0, facade.duration, 0.0)
    assertTrue(facade.isPaused)
    facade.currentTime = 50.0
    facade.play()
    facade.pause()
    assertEquals(listOf("setCurrentTime", "play", "pause"), host.commands)
    integration.active = true
    registration.close()
    assertEquals(123.0, facade.currentTime, 0.0)
    assertEquals(600.0, facade.duration, 0.0)
    facade.currentTime = 60.0
    assertEquals(12.0, integration.time, 0.0)
    facade.close()
  }

  @Test fun defaultIntegrationDelegatesAllPlaybackOperations() {
    val host = Host()
    val facade = PlayerFacade(host.player)
    facade.registerIntegration(object : Integration {})
    assertEquals(123.0, facade.currentTime, 0.0)
    assertEquals(600.0, facade.duration, 0.0)
    assertTrue(facade.isPaused)
    facade.currentTime = 5.0
    facade.play()
    facade.pause()
    assertEquals(listOf("setCurrentTime", "play", "pause"), host.commands)
    facade.close()
  }

  companion object {
    private fun clock(value: () -> Double?): Integration = object : Integration {
      override fun getCurrentTime(): Double? = value()
    }

    private inline fun <reified T> stub(crossinline call: (String, Array<out Any?>?) -> Any?): T =
      Proxy.newProxyInstance(T::class.java.classLoader, arrayOf(T::class.java)) { proxy, method, args ->
        when (method.name) {
          "equals" -> proxy === args?.get(0)
          "hashCode" -> System.identityHashCode(proxy)
          "toString" -> T::class.java.simpleName
          else -> call(method.name, args)
        }
      } as T

    private inline fun <reified T> event(type: EventType<*>, ad: Any): T = stub { method, _ ->
      when (method) {
        "getType" -> type
        "getAd", "getAdBreak" -> ad
        "getDate" -> Date(0)
        else -> null
      }
    }
  }
}
