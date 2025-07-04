import { Event, PlayerEventType } from 'react-native-theoplayer';

/**
 * The THEOlive event dispatched by the {@link THEOliveAPI | THEOlive API}.
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

export interface TheoLiveDistributionEvent extends TheoLiveEvent {
  /**
   * The distribution identifier
   *
   */
  distributionId: string;
}

/**
 * The THEOlive eventTypes used as subType in TheoLiveEvents.
 * @category Events
 * @category THEOlive
 * @public
 */
export enum TheoLiveEventType {
  /**
   * Fired when the loading of a THEOlive distribution starts.
   *
   * @public
   */
  DISTRIBUTION_LOAD_START = 'distributionloadstart',

  /**
   * Fired when loading a THEOlive distribution that cannot be played, for example because the publication is stopped or is still starting up.
   *
   * @public
   */
  DISTRIBUTION_OFFLINE = 'distributionoffline',

  /**
   * Fired when the loading of a THEOlive endpoint is complete and playback can start. This event is dispatched on every endpoint load, when an error
   * is encountered and the player recovers by choosing a new one.
   *
   * @public
   */
  ENDPOINT_LOADED = 'endpointloaded',

  /**
   * Fired when the player enters bad network mode.
   *
   * @public
   */
  ENTER_BADNETWORKMODE = 'enterbadnetworkmode',

  /**
   * Fired when the player exits bad network mode.
   *
   * @public
   */
  EXIT_BADNETWORKMODE = 'exitbadnetworkmode',

  /**
   * Fired when the player cannot play the current primary publication and would like to fallback. If a fallback has been configured it will fallback,
   * otherwise only the event is fired.
   *
   * @public
   */
  INTENT_TO_FALLBACK = 'intenttofallback'
}
