package com.theoplayer.integration

import androidx.annotation.MainThread
import com.theoplayer.android.api.ads.Ads
import com.theoplayer.android.api.event.ads.AdEvent

/**
 * Optional playback and advertising overrides for [PlayerFacade].
 *
 * Enable `usePlayerFacade` at player creation and register through [com.theoplayer.ReactTHEOplayerView.registerIntegration].
 * Unimplemented hooks delegate to the content player. The integration owns playback synchronization,
 * advertising lifecycle, and events describing its public state. All hooks run on the main thread.
 */
@MainThread
interface Integration {
  /** Returns a finite, non-negative time in seconds, or null to delegate. Invalid times also delegate. */
  fun getCurrentTime(): Double? = null

  /** Seeks to [currentTime] in seconds. Returns true if handled, or false to seek the content player. */
  fun setCurrentTime(currentTime: Double): Boolean = false

  /** Starts or resumes playback. Returns true if handled, or false to play the content player. */
  fun play(): Boolean = false

  /** Pauses playback. Returns true if handled, or false to pause the content player. */
  fun pause(): Boolean = false

  /** Returns the paused state, or null to use the content player's state. */
  fun isPaused(): Boolean? = null

  /** Returns the seeking state, or null to use the content player's state. */
  fun isSeeking(): Boolean? = null

  /** Returns the duration in seconds, or null to delegate. Infinity and NaN are preserved. */
  fun getDuration(): Double? = null

  /** Returns the muted state, or null to use the content player's state. */
  fun getMuted(): Boolean? = null

  /** Sets [muted]. Returns true if handled, or false to update the content player. */
  fun setMuted(muted: Boolean): Boolean = false

  /** Returns the volume between 0 and 1, or null to use the content player's volume. */
  fun getVolume(): Double? = null

  /** Sets [volume] between 0 and 1. Returns true if handled, or false to update the content player. */
  fun setVolume(volume: Double): Boolean = false

  /**
   * The Ads API and event source behind the stable facade Ads object, or null to retain native Ads.
   * Keep this object stable until registration closes. Existing listeners migrate on registration and close.
   */
  val ads: Ads? get() = null

  /**
   * Returns advertising state without replacing the native Ads API, or null to delegate.
   * Ignored when [ads] is supplied. State is never derived from dispatched events.
   */
  fun getAdState(): PlayerFacadeAdState? = null

  /**
   * Returns true to consume a native Ads [event] for all facade listeners, or false to forward it.
   * Called once per subscribed event. Integration-generated events bypass this hook.
   */
  fun shouldConsumeAdEvent(event: AdEvent<*>): Boolean = false
}
