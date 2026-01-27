import { Event, PlayerError, PlayerEventType, TheoLiveEndpoint } from 'react-native-theoplayer';
import { TheoLiveDistribution } from '../theolive/TheoLiveDistribution';

/**
 * The THEOlive event dispatched by the {@link TheoLiveAPI THEOlive API}.
 *
 * @category Events
 * @category THEOlive
 * @public
 */
export interface TheoLiveEvent extends Event<PlayerEventType.THEOLIVE_EVENT> {
  /**
   * Type of THEOlive event.
   */
  subType: TheoLiveEventType;
}

/**
 * Dispatched when the loading of a THEOlive distribution starts.
 *
 * @public
 */
export interface TheoLiveDistributionEvent extends TheoLiveEvent {
  /**
   * The distribution identifier
   */
  distributionId: string;
}

/**
 * Dispatched when a THEOlive distribution has been successfully loaded.
 *
 * @public
 */
export interface TheoLiveDistributionLoadedEvent extends TheoLiveEvent {
  /**
   * The distribution info.
   */
  distribution?: TheoLiveDistribution;
}

/**
 * Dispatched when the loading of a THEOlive endpoint is complete and playback can start.
 * This event is dispatched on every endpoint load, when an error is encountered and the player recovers by choosing
 * a new one.
 *
 * @public
 */
export interface TheoLiveEndpointLoadedEvent extends TheoLiveEvent {
  /**
   * The endpoint info
   */
  endpoint?: TheoLiveEndpoint;
}

/**
 * Fired when the player cannot play the current primary publication and would like to fallback. If a fallback has been configured it will fallback,
 * otherwise only the event is fired.
 *
 * @public
 */
export interface TheoLiveIntentToFallbackEvent extends TheoLiveEvent {
  /**
   * The reason why the player chose to fallback.
   */
  reason?: PlayerError;
}

/**
 * The THEOlive eventTypes used as subType in TheoLiveEvents.
 * @category Events
 * @category THEOlive
 * @public
 */
export enum TheoLiveEventType {
  /**
   * Dispatched when the loading of a THEOlive distribution starts.
   *
   * @public
   */
  DISTRIBUTION_LOAD_START = 'distributionloadstart',

  /**
   * Dispatched when a THEOlive distribution has been successfully loaded.
   *
   * @public
   */
  DISTRIBUTION_LOADED = 'distributionloaded',

  /**
   * Dispatched when loading a THEOlive distribution that cannot be played, for example because the publication is
   * stopped or is still starting up.
   *
   * @public
   */
  DISTRIBUTION_OFFLINE = 'distributionoffline',

  /**
   * Dispatched when the loading of a THEOlive endpoint is complete and playback can start.
   * This event is dispatched on every endpoint load, when an error is encountered and the player recovers by choosing
   * a new one.
   *
   * @public
   */
  ENDPOINT_LOADED = 'endpointloaded',

  /**
   * Dispatched when the player cannot play the current primary publication and would like to fallback.
   * If a fallback has been configured it will fallback, otherwise only the event is dispatched.
   *
   * @public
   */
  INTENT_TO_FALLBACK = 'intenttofallback'
}
