package com.theoplayer.integration

import androidx.annotation.MainThread
import com.theoplayer.android.api.event.EventType
import com.theoplayer.android.api.event.ads.AdEvent
import com.theoplayer.android.api.event.player.PlayerEvent
import java.io.Closeable

/**
 * Controls event delivery and the lifetime of an Android facade integration.
 *
 * Only the active registration can dispatch events or install interceptors. All operations run on the main thread.
 * Closing a registration restores native delegation without destroying either playback engine.
 */
@MainThread
class IntegrationRegistration internal constructor(
  private val facade: PlayerFacade,
  integration: Integration,
) : Closeable {
  internal var integration: Integration? = integration
    private set

  /**
   * Delivers [event] only to facade player listeners, bypassing native-event interceptors.
   * Does not emit on the raw content player. Calls after this registration closes have no effect.
   */
  fun dispatchEvent(event: PlayerEvent<*>) = facade.dispatchPlayerEvent(this, event)

  /**
   * Delivers [event] only to facade Ads listeners without deriving advertising state from it.
   * Bypasses native-ad filtering. Calls after this registration closes have no effect.
   */
  fun dispatchEvent(event: AdEvent<*>) = facade.dispatchAdEvent(this, event)

  /** Compatibility entry point for player events, equivalent to [dispatchEvent]. */
  fun dispatchPlayerEvent(event: PlayerEvent<*>) = dispatchEvent(event)

  /**
   * Intercepts native events of [type], even without facade listeners, before catch-all interceptors.
   * [interceptor] runs once per event; return true to consume it or false to continue delivery.
   *
   * The returned [Closeable] removes the interceptor. It must be closed explicitly: interception survives
   * unregistering so queued native events can drain. Closed registrations return a no-op disposer.
   */
  fun <T : PlayerEvent<*>> interceptPlayerEvent(type: EventType<T>, interceptor: (T) -> Boolean): Closeable =
    if (facade.isCurrent(this)) facade.playerEvents.intercept(type, interceptor) else Closeable {}

  /**
   * Intercepts all subscribed native player events after type-specific interceptors, including future subscriptions.
   * Return true from [interceptor] to consume the event. Does not subscribe to otherwise unobserved event types.
   *
   * The returned [Closeable] has the same explicit lifetime as [interceptPlayerEvent].
   * Integration-dispatched events bypass interception. Consuming native destruction never prevents facade cleanup.
   */
  fun interceptPlayerEvents(interceptor: (PlayerEvent<*>) -> Boolean): Closeable =
    if (facade.isCurrent(this)) facade.playerEvents.interceptAll(interceptor) else Closeable {}

  /**
   * Restores native playback and Ads delegation without destroying the content player. Idempotent.
   * Existing player-event interceptors remain until their disposers or the facade are closed.
   */
  override fun close() {
    integration = null
    facade.unregister(this)
  }
}
