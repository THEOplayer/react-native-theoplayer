import type { Event } from '../event/Event';
import { Interstitial } from './interstitial/Interstitial';

/**
 * The event types dispatched by the {@link TheoAdsAPI | THEOads API}.
 * 
 * @category THEOads
 * @category Events
 * @public
 */
export enum TheoAdsEventType {
    ADD_INTERSTITIAL = 'addinterstitial',
    INTERSTITIAL_BEGIN = 'interstitialbegin',
    INTERSTITIAL_END = 'interstitialend',
    INTERSTITIAL_UPDATE = 'interstitialupdate',
    INTERSTITIAL_ERROR = 'interstitialerror'
}

/**
 * The events fired by the {@link TheoAdsAPI | THEOads API}.
 * 
 * @category THEOads
 * @category Events
 * @public
 */
export interface TheoAdsEventMap {
    /**
     * Fired when an interstitial is added.
     */
    [TheoAdsEventType.ADD_INTERSTITIAL]: InterstitialEvent<TheoAdsEventType.ADD_INTERSTITIAL>

    /**
     * Fired when an interstitial begins.
     */
    [TheoAdsEventType.INTERSTITIAL_BEGIN]: InterstitialEvent<TheoAdsEventType.ADD_INTERSTITIAL>

    /**
     * Fired when an interstitial ends.
     */
    [TheoAdsEventType.INTERSTITIAL_END]: InterstitialEvent<TheoAdsEventType.ADD_INTERSTITIAL>

    /**
     * Fired when an interstitial is updated.
     */
    [TheoAdsEventType.INTERSTITIAL_UPDATE]: InterstitialEvent<TheoAdsEventType.ADD_INTERSTITIAL>

    /**
     * Fired when an interstitial has errored.
     */
    [TheoAdsEventType.INTERSTITIAL_ERROR]: InterstitialEvent<TheoAdsEventType.INTERSTITIAL_ERROR>
}

/**
 * Base type for events related to an interstitial.
 *
 * @category THEOads
 * @category Events
 * @public
 */
export interface InterstitialEvent<TType extends string> extends Event<TType> {
    /**
     * The interstitial.
     */
    readonly interstitial: Interstitial;
}