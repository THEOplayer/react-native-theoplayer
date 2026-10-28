import type { Ads } from 'theoplayer';
import type { Integration } from '../../../api/player/Integration';
import type { PlayerFacadeAds, PlayerFacadeAdsEventMap } from './PlayerFacadeTypes';

/**
 * Describes Web-specific advertising overrides for a player facade integration.
 * Optional overrides leave playback ownership and synchronization policy with the integration.
 *
 * @category Player
 * @platform web
 * @internal
 */
export interface PlayerFacadeIntegration extends Integration {
  /**
   * Supplies the Ads API and event source behind the stable public `player.ads` object.
   *
   * @remarks
   * Keep this object stable until the registration closes. Existing listeners migrate on registration and close.
   * Omit it to retain the content player's Ads API and optionally override only its state through {@link getAdState}.
   */
  readonly ads?: PlayerFacadeAds;

  /**
   * Returns the advertising state for integrations that do not supply an Ads object.
   *
   * @remarks
   * Legacy state override for integrations that do not supply an Ads object.
   * The facade never derives state from dispatched events. Update state before dispatching corresponding events.
   * An explicitly absent current ad break does not fall back to the content player's ad break.
   *
   * @returns The integration's ad state. Ignored when {@link ads} is supplied.
   */
  getAdState?(): Pick<Ads, 'playing' | 'currentAds' | 'currentAdBreak'>;

  /**
   * Consumes backing Ads events only; integration-generated events bypass this hook.
   *
   * @param event - The content player's advertising event.
   * @returns `true` to hide the event from all facade Ads listeners, or `false` to forward it.
   *
   * @remarks
   * Called once per subscribed event, not once per listener. Events from {@link ads} bypass this hook.
   */
  shouldConsumeAdEvent?(event: PlayerFacadeAdsEventMap[keyof PlayerFacadeAdsEventMap]): boolean;
}
