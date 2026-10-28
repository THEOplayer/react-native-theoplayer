package com.theoplayer.integration

import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.Ads
import com.theoplayer.android.api.event.Event
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.player.Player
import java.lang.reflect.Proxy
import java.util.Date

internal class PlayerFacadeTestHost {
  val adListeners = linkedMapOf<EventType<*>, MutableSet<EventListener<*>>>()
  val playerListeners = linkedMapOf<EventType<*>, MutableSet<EventListener<*>>>()
  var currentTime = 123.0
  var duration = 600.0
  var paused = true
  var seeking = false
  var muted = false
  var volume = 0.8
  var adsReads = 0
  var playingAds = false
  var currentAds = emptyList<Ad>()
  var currentBreak: AdBreak? = null
  var failAdSubscription: EventType<*>? = null
  val scheduledAds = mutableListOf<Ad>()
  val commands = mutableListOf<String>()
  val ads = facadeStub<Ads> { method, args ->
    when (method) {
      "isPlaying" -> playingAds
      "getCurrentAds" -> currentAds
      "getCurrentAdBreak" -> currentBreak
      "getScheduledAds" -> scheduledAds
      "addEventListener" -> {
        add(adListeners, args)
        check(args!![0] != failAdSubscription) { "subscription failed" }
        null
      }
      "removeEventListener" -> remove(adListeners, args)
      "skip", "schedule", "registerServerSideIntegration" -> { commands.add(method); null }
      else -> null
    }
  }
  val player = facadeStub<Player> { method, args ->
    when (method) {
      "getAds" -> { adsReads++; ads }
      "getCurrentTime" -> currentTime
      "getDuration" -> duration
      "isPaused" -> paused
      "isSeeking" -> seeking
      "isMuted" -> muted
      "getVolume" -> volume
      "addEventListener" -> add(playerListeners, args)
      "removeEventListener" -> remove(playerListeners, args)
      "setCurrentTime" -> { commands.add(method); currentTime = args!![0] as Double; null }
      "setMuted" -> { commands.add(method); muted = args!![0] as Boolean; null }
      "setVolume" -> { commands.add(method); volume = args!![0] as Double; null }
      "play" -> { commands.add(method); paused = false; null }
      "pause" -> { commands.add(method); paused = true; null }
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

  fun emitPlayer(event: Event<*>) = emit(playerListeners, event)
  fun emitAd(event: Event<*>) = emit(adListeners, event)

  private fun emit(listeners: Map<EventType<*>, Set<EventListener<*>>>, event: Event<*>) {
    listeners[event.type]?.toList()?.forEach {
      @Suppress("UNCHECKED_CAST")
      (it as EventListener<Event<*>>).handleEvent(event)
    }
  }
}

internal inline fun <reified T> facadeStub(crossinline call: (String, Array<out Any?>?) -> Any?): T =
  Proxy.newProxyInstance(T::class.java.classLoader, arrayOf(T::class.java)) { proxy, method, args ->
    when (method.name) {
      "equals" -> proxy === args?.get(0)
      "hashCode" -> System.identityHashCode(proxy)
      "toString" -> T::class.java.simpleName
      else -> call(method.name, args)
    }
  } as T

internal inline fun <reified T> facadeEvent(type: EventType<*>, payload: Any? = null): T = facadeStub { method, _ ->
  when (method) {
    "getType" -> type
    "getAd", "getAdBreak" -> payload
    "getCurrentTime" -> 123.0
    "getDate" -> Date(0)
    else -> null
  }
}
