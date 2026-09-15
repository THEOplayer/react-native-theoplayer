import type { AdsEventMap, ChromelessPlayer } from 'theoplayer';
import type { Integration } from './Integration';

export interface IntegrationRegistration {
  dispatchEvent<TEvent extends AdsEventMap[keyof AdsEventMap]>(event: TEvent): void;
  close(): void;
}

export interface PlayerFacade extends ChromelessPlayer {
  readonly contentPlayer: ChromelessPlayer;
  registerIntegration(integration: Integration): IntegrationRegistration;
}
