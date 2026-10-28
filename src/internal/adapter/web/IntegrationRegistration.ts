import type { PlayerEventMap } from 'theoplayer';
import type { PlayerFacadeEvent } from './PlayerFacadeTypes';

/**
 * Controls event delivery and the lifetime of a registered Web integration.
 *
 * @category Player
 * @platform web
 * @internal
 */
export interface IntegrationRegistration {
  /**
   * Compatibility entry point for player events; equivalent to dispatchEvent(event).
   *
   * @param event - The player event to deliver to facade listeners.
   */
  dispatchPlayerEvent<TEvent extends PlayerEventMap[keyof PlayerEventMap]>(event: TEvent): void;

  /**
   * Routes typed THEOplayer events to player or player.ads listeners without emitting on the content player.
   * Bypasses backing-event interceptors and ignores calls after the registration closes.
   *
   * @param event - The player or advertising event to deliver. Advertising events go only to Ads listeners.
   */
  dispatchEvent<TEvent extends PlayerFacadeEvent>(event: TEvent): void;

  /**
   * Return true to consume a backing-player event before facade listeners receive it.
   * Dispose explicitly: interceptors survive unregistering to allow already-queued events to drain.
   *
   * @param type - The event type to intercept, even when it has no facade listeners.
   * @param interceptor - Called once per event; return `false` to continue delivery.
   * @returns An idempotent disposer. Closed registrations return a no-op disposer.
   */
  interceptPlayerEvent<TType extends keyof PlayerEventMap>(type: TType, interceptor: (event: PlayerEventMap[TType]) => boolean): () => void;

  /**
   * Filters every subscribed backing-player event after type-specific interceptors, including future subscriptions.
   * Uses the same explicit disposer lifetime; integration dispatch bypasses this filter.
   *
   * @param interceptor - Return `true` to consume the event, or `false` to continue delivery.
   * @returns An idempotent disposer. Closed registrations return a no-op disposer.
   *
   * @remarks
   * This does not subscribe to otherwise unobserved event types. Consuming a native destroy event does not prevent facade cleanup.
   */
  interceptPlayerEvents(interceptor: (event: PlayerEventMap[keyof PlayerEventMap]) => boolean): () => void;

  /**
   * Restores content-player delegation without destroying the content player.
   *
   * @remarks
   * Idempotent. Stops integration dispatch and restores native Ads subscriptions.
   * Existing player-event interceptors remain until explicitly disposed or the facade closes.
   */
  close(): void;
}
