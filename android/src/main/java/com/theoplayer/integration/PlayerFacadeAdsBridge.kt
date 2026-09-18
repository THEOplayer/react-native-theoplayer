package com.theoplayer.integration

import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.Ads
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegration
import com.theoplayer.android.api.ads.ima.GoogleImaAdErrorEvent
import com.theoplayer.android.api.ads.ima.GoogleImaAdEvent
import com.theoplayer.android.api.ads.ima.GoogleImaAdEventType
import com.theoplayer.android.api.ads.ima.GoogleImaIntegration
import com.theoplayer.android.api.ads.wrapper.AdsApiWrapper
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.ads.AdBreakEvent
import com.theoplayer.android.api.event.ads.AdEvent
import com.theoplayer.android.api.event.ads.AdsEventTypes
import com.theoplayer.android.api.event.ads.SingleAdEvent
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.source.SourceDescription
import com.theoplayer.android.api.source.addescription.AdDescription

internal class PlayerFacadeAdsBridge(private val nativeApi: AdsApiWrapper) {
  private var facade: PlayerFacade? = null
  private val relay = EventListener<AdEvent<*>> { event ->
    when (event) {
      is GoogleImaAdEvent -> nativeApi.dispatchAdEvent(event.type, event.ad, event.adData, (event as? GoogleImaAdErrorEvent)?.adError)
      is SingleAdEvent<*> -> nativeApi.dispatchAdEvent(event.type, event.ad, null, null)
      is AdBreakEvent<*> -> nativeApi.dispatchAdBreakEvent(event.type, event.adBreak, null, null)
    }
  }

  val isPlaying: Boolean get() = facade?.adStateOverride()?.playing ?: nativeApi.isPlaying
  val currentAds: List<Ad> get() = facade?.adStateOverride()?.currentAds ?: nativeApi.currentAds
  val currentAdBreak: AdBreak?
    get() {
      val state = facade?.adStateOverride()
      return if (state != null) state.currentAdBreak else nativeApi.currentAdBreak
    }
  val scheduledAdBreaks: List<AdBreak>
    get() = facade?.integrationAds?.scheduledAds?.mapNotNull { it.adBreak }?.distinct() ?: nativeApi.scheduledAdBreaks

  fun initialize(player: Player, ima: GoogleImaIntegration?, dai: GoogleDaiIntegration?) {
    destroy()
    val current = player as? PlayerFacade
    facade = current
    val nativePlayer = if (current == null) player else {
      val nativeAds = object : Ads by current.contentPlayer.ads {
        override fun <T : AdEvent<*>> addEventListener(type: EventType<T>, listener: EventListener<in T>) =
          current.adEvents.addEventListener(type, listener, false)

        override fun <T : AdEvent<*>> removeEventListener(type: EventType<T>, listener: EventListener<in T>) =
          current.adEvents.removeEventListener(type, listener)
      }
      object : Player by current.contentPlayer {
        override fun getAds(): Ads = nativeAds
      }
    }
    nativeApi.initialize(nativePlayer, ima, dai)
    if (current != null) {
      try {
        for (type in eventTypes) current.adEvents.addEventListener(type, relay, true)
      } catch (error: Exception) {
        destroy()
        throw error
      }
    }
  }

  fun setSource(source: SourceDescription?) = nativeApi.setSource(source)

  fun schedule(ad: AdDescription) {
    val ads = facade?.integrationAds
    if (ads != null) ads.schedule(ad) else nativeApi.schedule(ad)
  }

  fun skip() {
    val ads = facade?.integrationAds
    if (ads != null) ads.skip() else nativeApi.skip()
  }

  fun destroy() {
    facade?.let { current ->
      for (type in eventTypes) current.adEvents.removeEventListener(type, relay)
    }
    facade = null
    nativeApi.destroy()
  }

  companion object {
    @Suppress("UNCHECKED_CAST")
    private val eventTypes = (listOf(
      AdsEventTypes.AD_BEGIN,
      AdsEventTypes.AD_END,
      AdsEventTypes.AD_SKIP,
      AdsEventTypes.AD_ERROR,
      AdsEventTypes.AD_BREAK_BEGIN,
      AdsEventTypes.AD_BREAK_END,
      AdsEventTypes.AD_LOADED,
      AdsEventTypes.AD_IMPRESSION,
      AdsEventTypes.AD_FIRST_QUARTILE,
      AdsEventTypes.AD_THIRD_QUARTILE,
      AdsEventTypes.AD_MIDPOINT,
      AdsEventTypes.ADD_AD,
      AdsEventTypes.ADD_AD_BREAK,
      AdsEventTypes.AD_BREAK_CHANGE,
      AdsEventTypes.REMOVE_AD_BREAK,
      AdsEventTypes.AD_CLICKED,
      AdsEventTypes.AD_TAPPED,
    ) + GoogleImaAdEventType.values()).map { it as EventType<AdEvent<*>> }
  }
}
