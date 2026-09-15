import type { AdEvent, Ads, AdsEventMap, ChromelessPlayer, EventDispatcher, PlayerEventMap } from 'theoplayer';
import type { Integration } from '../../../api/player/Integration';

export type PlayerFacadeAdsEventMap = AdsEventMap & { adclicked: AdEvent<'adclicked'> };

export type PlayerFacadeAds = Omit<Ads, 'addEventListener' | 'removeEventListener'> & EventDispatcher<PlayerFacadeAdsEventMap>;

export type PlayerFacadeEvent = PlayerEventMap[keyof PlayerEventMap] | PlayerFacadeAdsEventMap[keyof PlayerFacadeAdsEventMap];

/** Optional overrides leave playback ownership and synchronization policy with the integration. */
export interface PlayerFacadeIntegration extends Integration {
  /** Overrides public seeking state; nullish results delegate to the backing player. */
  isSeeking?(): boolean | null | undefined;
  /** Supplies the Ads API and event source behind the stable public player.ads object. */
  readonly ads?: PlayerFacadeAds;
  /** Legacy state override for integrations that do not supply an Ads object. */
  getAdState?(): Pick<Ads, 'playing' | 'currentAds' | 'currentAdBreak'>;
  /** Consumes backing Ads events only; integration-generated events bypass this hook. */
  shouldConsumeAdEvent?(event: PlayerFacadeAdsEventMap[keyof PlayerFacadeAdsEventMap]): boolean;
  /** Nullish getter results fall back to the content player. */
  getMuted?(): boolean | null | undefined;
  /** Return true when handled, or false to let the content player handle the write. */
  setMuted?(muted: boolean): boolean;
  /** Nullish getter results fall back to the content player. */
  getVolume?(): number | null | undefined;
  /** Return true when handled, or false to let the content player handle the write. */
  setVolume?(volume: number): boolean;
}

export interface IntegrationRegistration {
  /** Compatibility entry point for player events; equivalent to dispatchEvent(event). */
  dispatchPlayerEvent<TEvent extends PlayerEventMap[keyof PlayerEventMap]>(event: TEvent): void;
  /**
   * Routes typed THEOplayer events to player or player.ads listeners without emitting on the content player.
   * Bypasses backing-event interceptors and ignores calls after the registration closes.
   */
  dispatchEvent<TEvent extends PlayerFacadeEvent>(event: TEvent): void;
  /**
   * Return true to consume a backing-player event before facade listeners receive it.
   * Dispose explicitly: interceptors survive unregistering to allow already-queued events to drain.
   */
  interceptPlayerEvent<TType extends keyof PlayerEventMap>(type: TType, interceptor: (event: PlayerEventMap[TType]) => boolean): () => void;
  /**
   * Filters every subscribed backing-player event after type-specific interceptors, including future subscriptions.
   * Uses the same explicit disposer lifetime; integration dispatch bypasses this filter.
   */
  interceptPlayerEvents(interceptor: (event: PlayerEventMap[keyof PlayerEventMap]) => boolean): () => void;
  /** Restores content-player delegation without destroying the content player. */
  close(): void;
}

export interface PlayerFacade extends ChromelessPlayer {
  readonly ads: Ads & EventDispatcher<PlayerFacadeAdsEventMap>;
  /** Raw playback engine, unaffected by integration overrides or event interception. */
  readonly contentPlayer: ChromelessPlayer;
  /** Only one integration may be registered at a time. */
  registerIntegration(integration: PlayerFacadeIntegration): IntegrationRegistration;
}
