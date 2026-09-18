package com.theoplayer.integration

import androidx.annotation.MainThread
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.Ads
import com.theoplayer.android.api.ads.Omid
import com.theoplayer.android.api.ads.ServerSideAdIntegrationFactory
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegration
import com.theoplayer.android.api.ads.dai.dai as sdkDai
import com.theoplayer.android.api.ads.ima.GoogleImaIntegration
import com.theoplayer.android.api.ads.ima.ima as sdkIma
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.ads.AdEvent
import com.theoplayer.android.api.source.addescription.AdDescription

/**
 * Stable advertising API whose state, controls, and event source follow the current [Integration].
 * Advertising lifecycle is owned by the integration, never inferred from dispatched events.
 */
@MainThread
class PlayerFacadeAds internal constructor(
  private val nativeAds: Ads,
  private val integration: () -> Integration?,
  private val events: PlayerFacadeEvents<AdEvent<*>>,
) : Ads {
  private val backing: Ads get() = integration()?.ads ?: nativeAds

  /** Native IMA integration, resolved on the raw Ads API rather than this facade. */
  val ima: GoogleImaIntegration get() = nativeAds.sdkIma

  /** Native DAI integration, resolved on the raw Ads API rather than this facade. */
  val dai: GoogleDaiIntegration get() = nativeAds.sdkDai

  /** Returns whether the integration or native Ads API is playing a linear advertisement. */
  override fun isPlaying(): Boolean = integration()?.let { it.ads?.isPlaying ?: it.getAdState()?.playing } ?: nativeAds.isPlaying

  /** Returns the current advertisements from the integration or native Ads API. */
  override fun getCurrentAds(): List<Ad> = integration()?.let { it.ads?.currentAds ?: it.getAdState()?.currentAds } ?: nativeAds.currentAds

  /** Returns the active ad break. An integration's explicit null does not fall back to native Ads. */
  override fun getCurrentAdBreak(): AdBreak? {
    val current = integration()
    current?.ads?.let { return it.currentAdBreak }
    current?.getAdState()?.let { return it.currentAdBreak }
    return nativeAds.currentAdBreak
  }

  /** Returns advertisements scheduled by the currently delegated Ads API. */
  override fun getScheduledAds(): List<Ad> = backing.scheduledAds

  /** Schedules [adDescription] through the currently delegated Ads API. */
  override fun schedule(adDescription: AdDescription) = backing.schedule(adDescription)

  /** Skips the current advertisement through the currently delegated Ads API. */
  override fun skip() = backing.skip()

  /** Returns the Open Measurement API of the currently delegated Ads API. */
  override fun getOmid(): Omid = backing.omid

  /** Registers [factory] for [integrationId] on the currently delegated Ads API. */
  override fun registerServerSideIntegration(integrationId: String, factory: ServerSideAdIntegrationFactory) =
    backing.registerServerSideIntegration(integrationId, factory)

  /** Adds [listener] for [type], preserving the subscription across integration changes. Duplicate listeners are ignored. */
  override fun <T : AdEvent<*>> addEventListener(type: EventType<T>, listener: EventListener<in T>) = events.addEventListener(type, listener)

  /** Removes [listener] for [type]. Removing an absent listener has no effect. */
  override fun <T : AdEvent<*>> removeEventListener(type: EventType<T>, listener: EventListener<in T>) = events.removeEventListener(type, listener)
}
