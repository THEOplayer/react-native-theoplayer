import type { Ads, ChromelessPlayer, EventDispatcher } from 'theoplayer';
import type { IntegrationRegistration } from './IntegrationRegistration';
import type { PlayerFacadeIntegration } from './PlayerFacadeIntegration';
import type { PlayerFacadeAdsEventMap } from './PlayerFacadeTypes';

/**
 * Describes the stable native Web player handle when the player facade is enabled.
 *
 * @category Player
 * @platform web
 * @internal
 */
export interface PlayerFacadeAPI extends ChromelessPlayer {
  /**
   * The stable advertising API, including integration-generated `adclicked` events.
   * Delegates to the registered integration's Ads API or the content player's Ads API.
   */
  readonly ads: Ads & EventDispatcher<PlayerFacadeAdsEventMap>;

  /**
   * Raw playback engine, unaffected by integration overrides or event interception.
   * Use this player for playback engines and ad schedulers that require the content timeline.
   */
  readonly contentPlayer: ChromelessPlayer;

  /**
   * Registers an integration that optionally overrides playback and advertising behavior.
   * Only one integration may be registered at a time.
   *
   * @param integration - The hooks and optional Ads API to use until the registration closes.
   * @returns The registration used to dispatch events, install interceptors, and unregister.
   * @throws If the facade is closed, an integration is already registered, or a hook is not a function.
   */
  registerIntegration(integration: PlayerFacadeIntegration): IntegrationRegistration;
}
