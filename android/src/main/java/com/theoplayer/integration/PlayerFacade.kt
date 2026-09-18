package com.theoplayer.integration

import androidx.annotation.MainThread
import com.theoplayer.android.api.ads.Ads
import com.theoplayer.android.api.ads.dai.GoogleDaiIntegration
import com.theoplayer.android.api.ads.dai.dai as sdkDai
import com.theoplayer.android.api.ads.ima.GoogleImaIntegration
import com.theoplayer.android.api.ads.ima.ima as sdkIma
import com.theoplayer.android.api.ads.theoads.TheoAdsIntegration
import com.theoplayer.android.api.ads.theoads.theoAds as sdkTheoAds
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.ads.AdEvent
import com.theoplayer.android.api.event.player.PlayerEvent
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.android.api.player.Player
import java.io.Closeable

/**
 * Stable player surface with integration-owned playback, advertising state, and event interception.
 *
 * Enable `usePlayerFacade` at player creation to expose this surface through [com.theoplayer.ReactTHEOplayerView.player].
 * Unhandled operations delegate to [contentPlayer]; the facade never owns playback or advertising lifecycle.
 *
 * @property contentPlayer Raw playback engine, unaffected by integration overrides or event interception.
 */
@MainThread
class PlayerFacade internal constructor(val contentPlayer: Player) : Player by contentPlayer, Closeable {
  companion object {
    internal fun create(contentPlayer: Player, enabled: Boolean): Player =
      if (enabled) PlayerFacade(contentPlayer) else contentPlayer
  }

  private val nativeAds = contentPlayer.ads
  private var registration: IntegrationRegistration? = null
  private var closed = false
  private val integration: Integration? get() = registration?.integration
  internal val playerEvents = PlayerFacadeEvents(
    source = { contentPlayer },
    after = { event -> if (event.type == PlayerEventTypes.DESTROY) close() },
  )
  internal val adEvents = PlayerFacadeEvents(
    source = { integration?.ads ?: nativeAds },
    isIntegrationSource = { integration?.ads?.let { it !== nativeAds } == true },
    consume = { event ->
      val current = integration
      (current?.ads == null || current.ads === nativeAds) && current?.shouldConsumeAdEvent(event) == true
    },
  )
  private val adsFacade = PlayerFacadeAds(nativeAds, { integration }, adEvents)

  init {
    playerEvents.retain(PlayerEventTypes.DESTROY)
  }

  /** Native THEOads integration, resolved on the raw content player rather than this facade. */
  val theoAds: TheoAdsIntegration get() = contentPlayer.sdkTheoAds

  /** Returns the stable Ads facade. Existing references survive integration registration and removal. */
  override fun getAds(): PlayerFacadeAds = adsFacade

  /** Returns integration time in seconds when finite and non-negative, or the content player's time. */
  override fun getCurrentTime(): Double = integration?.getCurrentTime()?.takeIf { it.isFinite() && it >= 0 } ?: contentPlayer.currentTime

  /** Seeks to [currentTime] in seconds, delegating to the content player unless the integration handles it. */
  override fun setCurrentTime(currentTime: Double) {
    if (integration?.setCurrentTime(currentTime) != true) contentPlayer.currentTime = currentTime
  }

  /** Starts or resumes playback, delegating to the content player unless the integration handles it. */
  override fun play() {
    if (integration?.play() != true) contentPlayer.play()
  }

  /** Pauses playback, delegating to the content player unless the integration handles it. */
  override fun pause() {
    if (integration?.pause() != true) contentPlayer.pause()
  }

  /** Returns the integration's paused state, or the native state when the hook returns null. */
  override fun isPaused(): Boolean = integration?.isPaused() ?: contentPlayer.isPaused

  /** Returns the integration's seeking state, or the native state when the hook returns null. */
  override fun isSeeking(): Boolean = integration?.isSeeking() ?: contentPlayer.isSeeking

  /** Returns duration in seconds, delegating on null. Infinity and NaN remain unchanged. */
  override fun getDuration(): Double = integration?.getDuration() ?: contentPlayer.duration

  /** Returns the integration's muted state, or the native state when the hook returns null. */
  override fun isMuted(): Boolean = integration?.getMuted() ?: contentPlayer.isMuted

  /** Sets [muted], delegating to the content player unless the integration handles it. */
  override fun setMuted(muted: Boolean) {
    if (integration?.setMuted(muted) != true) contentPlayer.isMuted = muted
  }

  /** Returns the integration's volume between 0 and 1, or the native volume when the hook returns null. */
  override fun getVolume(): Double = integration?.getVolume() ?: contentPlayer.volume

  /** Sets [volume] between 0 and 1, delegating unless the integration handles it. */
  override fun setVolume(volume: Double) {
    if (integration?.setVolume(volume) != true) contentPlayer.volume = volume
  }

  /** Adds [listener] for [type] after integration interception. Duplicate listeners are ignored. */
  override fun <T : PlayerEvent<*>> addEventListener(type: EventType<T>, listener: EventListener<in T>) = playerEvents.addEventListener(type, listener)

  /** Removes [listener] for [type]. Removing an absent listener has no effect. */
  override fun <T : PlayerEvent<*>> removeEventListener(type: EventType<T>, listener: EventListener<in T>) = playerEvents.removeEventListener(type, listener)

  /**
   * Registers [integration] and migrates existing Ads listeners to its optional Ads API.
   *
   * @return The registration used to dispatch events, intercept native events, and unregister.
   * @throws IllegalStateException if the facade is closed or another integration is registered.
   */
  fun registerIntegration(integration: Integration): IntegrationRegistration {
    check(!closed) { "The player facade has been closed." }
    check(registration == null) { "Unregister the previous integration first." }
    val current = IntegrationRegistration(this, integration)
    registration = current
    try {
      adEvents.rebind()
    } catch (error: Exception) {
      current.close()
      throw error
    }
    return current
  }

  internal val integrationAds: Ads? get() = integration?.ads

  internal fun adStateOverride(): PlayerFacadeAdState? {
    val current = integration
    return current?.ads?.let { PlayerFacadeAdState(it.isPlaying, it.currentAds, it.currentAdBreak) } ?: current?.getAdState()
  }

  internal fun destroyContent(destroy: () -> Unit) {
    try {
      destroy()
    } finally {
      close()
    }
  }

  internal fun isCurrent(current: IntegrationRegistration): Boolean = !closed && registration === current

  internal fun dispatchPlayerEvent(current: IntegrationRegistration, event: PlayerEvent<*>) {
    if (isCurrent(current)) playerEvents.dispatch(event) { isCurrent(current) }
  }

  internal fun dispatchAdEvent(current: IntegrationRegistration, event: AdEvent<*>) {
    if (isCurrent(current)) adEvents.dispatch(event, true) { isCurrent(current) }
  }

  internal fun unregister(current: IntegrationRegistration) {
    if (registration !== current) return
    registration = null
    if (!closed) adEvents.rebind()
  }

  /**
   * Releases facade listeners, interceptors, and the active registration. Idempotent.
   * Does not destroy the content player. Native destruction also closes the facade, even when intercepted.
   */
  override fun close() {
    if (closed) return
    closed = true
    registration?.close()
    playerEvents.close()
    adEvents.close()
  }
}

/** Resolves THEOads on the native content player when this player is a facade. */
val Player.theoAds: TheoAdsIntegration
  get() = if (this is PlayerFacade) this.theoAds else this.sdkTheoAds

/** Resolves IMA on the native Ads API when this object is a facade. */
val Ads.ima: GoogleImaIntegration
  get() = if (this is PlayerFacadeAds) this.ima else this.sdkIma

/** Resolves DAI on the native Ads API when this object is a facade. */
val Ads.dai: GoogleDaiIntegration
  get() = if (this is PlayerFacadeAds) this.dai else this.sdkDai
