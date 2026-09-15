package com.theoplayer

import androidx.annotation.MainThread
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.Ads
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegration
import com.theoplayer.android.api.ads.dai.dai as sdkDai
import com.theoplayer.android.api.ads.ima.GoogleImaIntegration
import com.theoplayer.android.api.ads.ima.ima as sdkIma
import com.theoplayer.android.api.ads.theoads.TheoAdsIntegration
import com.theoplayer.android.api.ads.theoads.theoAds as sdkTheoAds
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.ads.AdBeginEvent
import com.theoplayer.android.api.event.ads.AdBreakBeginEvent
import com.theoplayer.android.api.event.ads.AdBreakEndEvent
import com.theoplayer.android.api.event.ads.AdEndEvent
import com.theoplayer.android.api.event.ads.AdEvent
import com.theoplayer.android.api.event.ads.AdSkipEvent
import com.theoplayer.android.api.event.ads.SingleAdEvent
import com.theoplayer.android.api.player.Player
import java.io.Closeable

@MainThread
class PlayerFacade internal constructor(private val contentPlayer: Player) : Player by contentPlayer, Closeable {
  companion object {
    internal fun create(contentPlayer: Player, enabled: Boolean): Player =
      if (enabled) PlayerFacade(contentPlayer) else contentPlayer
  }

  private class Subscription(val emit: (AdEvent<*>) -> Unit, val remove: () -> Unit)

  private val nativeAds = contentPlayer.ads
  private val subscriptions = mutableMapOf<EventType<*>, MutableMap<EventListener<*>, Subscription>>()
  private var registration: IntegrationRegistration? = null
  private var currentAd: Ad? = null
  private var currentBreak: AdBreak? = null
  private var revision = 0L
  private var closed = false
  private val adsFacade = AdsFacade()

  val theoAds: TheoAdsIntegration
    get() = contentPlayer.sdkTheoAds

  inner class AdsFacade internal constructor() : Ads by nativeAds {
    val ima: GoogleImaIntegration
      get() = nativeAds.sdkIma

    val dai: GoogleDaiIntegration
      get() = nativeAds.sdkDai

    override fun isPlaying(): Boolean = if (registration != null) currentAd?.type == "linear" else nativeAds.isPlaying
    override fun getCurrentAds(): List<Ad> = if (registration != null) listOfNotNull(currentAd) else nativeAds.currentAds
    override fun getCurrentAdBreak(): AdBreak? = if (registration != null) currentBreak else nativeAds.currentAdBreak

    override fun <T : AdEvent<*>> addEventListener(type: EventType<T>, listener: EventListener<in T>) {
      check(!closed) { "The player facade has been closed." }
      val listeners = subscriptions.getOrPut(type) { linkedMapOf() }
      if (listeners.containsKey(listener)) return
      val nativeListener = EventListener<T> { if (!closed && registration == null) listener.handleEvent(it) }
      @Suppress("UNCHECKED_CAST")
      val subscription = Subscription(
        { event -> listener.handleEvent(event as T) },
        { nativeAds.removeEventListener(type, nativeListener) },
      )
      nativeAds.addEventListener(type, nativeListener)
      listeners[listener] = subscription
    }

    override fun <T : AdEvent<*>> removeEventListener(type: EventType<T>, listener: EventListener<in T>) {
      subscriptions[type]?.remove(listener)?.remove?.invoke()
      if (subscriptions[type]?.isEmpty() == true) subscriptions.remove(type)
    }
  }

  override fun getAds(): AdsFacade = adsFacade

  override fun getCurrentTime(): Double =
    registration?.integration?.getCurrentTime()?.takeIf { it.isFinite() && it >= 0 } ?: contentPlayer.currentTime

  override fun setCurrentTime(currentTime: Double) {
    if (registration?.integration?.setCurrentTime(currentTime) != true) contentPlayer.currentTime = currentTime
  }

  override fun play() {
    if (registration?.integration?.play() != true) contentPlayer.play()
  }

  override fun pause() {
    if (registration?.integration?.pause() != true) contentPlayer.pause()
  }

  override fun isPaused(): Boolean = registration?.integration?.isPaused() ?: contentPlayer.isPaused

  override fun getDuration(): Double = registration?.integration?.getDuration() ?: contentPlayer.duration

  fun registerIntegration(integration: Integration): IntegrationRegistration {
    check(!closed) { "The player facade has been closed." }
    check(registration == null) { "Unregister the previous integration first." }
    check(!nativeAds.isPlaying && nativeAds.currentAdBreak == null) { "Cannot register an integration during native ads." }
    return IntegrationRegistration(integration).also { registration = it }
  }

  @MainThread
  inner class IntegrationRegistration internal constructor(integration: Integration) : Closeable {
    internal var integration: Integration? = integration
      private set

    fun dispatchEvent(event: AdEvent<*>) {
      if (closed || registration !== this) return
      when (event) {
        is AdBreakBeginEvent -> {
          revision++
          currentBreak = event.adBreak
          currentAd = null
        }
        is AdBeginEvent -> {
          revision++
          currentAd = event.ad
          currentBreak = event.ad?.adBreak ?: currentBreak
        }
      }
      val eventRevision = revision
      try {
        subscriptions[event.type]?.values?.toList()?.forEach {
          if (!closed && registration === this) it.emit(event)
        }
      } finally {
        if (registration === this && revision == eventRevision) {
          when (event) {
            is AdEndEvent, is AdSkipEvent -> {
              if ((event as SingleAdEvent<*>).ad === currentAd) currentAd = null
            }
            is AdBreakEndEvent -> {
              if (event.adBreak === currentBreak) {
                currentAd = null
                currentBreak = null
              }
            }
          }
        }
      }
    }

    override fun close() {
      integration = null
      if (registration !== this) return
      registration = null
      currentAd = null
      currentBreak = null
      revision++
    }
  }

  override fun close() {
    if (closed) return
    closed = true
    registration?.close()
    val listeners = subscriptions.values.flatMap { it.values }
    subscriptions.clear()
    listeners.forEach { it.remove() }
  }
}

val Player.theoAds: TheoAdsIntegration
  get() = if (this is PlayerFacade) this.theoAds else this.sdkTheoAds

val Ads.ima: GoogleImaIntegration
  get() = if (this is PlayerFacade.AdsFacade) this.ima else this.sdkIma

val Ads.dai: GoogleDaiIntegration
  get() = if (this is PlayerFacade.AdsFacade) this.dai else this.sdkDai
