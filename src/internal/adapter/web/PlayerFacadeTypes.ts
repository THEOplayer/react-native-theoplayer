import type { AdEvent, Ads, AdsEventMap, EventDispatcher, PlayerEventMap } from 'theoplayer';

export type { IntegrationRegistration } from './IntegrationRegistration';
export type { PlayerFacadeAPI as PlayerFacade } from './PlayerFacadeAPI';
export type { PlayerFacadeIntegration } from './PlayerFacadeIntegration';

/** Advertising events supported by the facade, including integration-generated clicks. */
export type PlayerFacadeAdsEventMap = AdsEventMap & { adclicked: AdEvent<'adclicked'> };

/** The Web Ads API with event subscriptions extended to support facade advertising events. */
export type PlayerFacadeAds = Omit<Ads, 'addEventListener' | 'removeEventListener'> & EventDispatcher<PlayerFacadeAdsEventMap>;

/** A native Web player or advertising event that an integration can dispatch through its registration. */
export type PlayerFacadeEvent = PlayerEventMap[keyof PlayerEventMap] | PlayerFacadeAdsEventMap[keyof PlayerFacadeAdsEventMap];
