import { PlayerError, TheoLiveEndpoint, TheoLiveEvent, TheoLiveEventType } from 'react-native-theoplayer';
import { NativeSyntheticEvent } from 'react-native';
import {
  DefaultTheoLiveDistributionEvent,
  DefaultTheoLiveDistributionLoadedEvent,
  DefaultTheoLiveEndpointLoadedEvent,
  DefaultTheoLiveEvent,
  DefaultTheoLiveIntentToFallbackEvent,
} from '../PlayerEvents';
import { TheoLiveDistribution } from '../../../../api/theolive/TheoLiveDistribution';

export interface NativeTheoLiveEvent {
  /**
   * Type of TheoLive event.
   */
  type: TheoLiveEventType;

  /**
   * The distribution identifier for DISTRIBUTION_LOAD_START or DISTRIBUTION_OFFLINE events
   */
  distributionId: string | undefined;

  /**
   * Description of the THEOlive distribution.
   */
  distribution: TheoLiveDistribution | undefined;

  /**
   * Description of the THEOlive endpoint.
   */
  endpoint: TheoLiveEndpoint | undefined;

  /**
   * The reason for the fallback.
   */
  reason: PlayerError | undefined;
}

export function fromNativeTheoLiveEvent(event: NativeSyntheticEvent<NativeTheoLiveEvent>): TheoLiveEvent {
  const { nativeEvent } = event;
  switch (event.type) {
    case TheoLiveEventType.DISTRIBUTION_LOAD_START:
      return new DefaultTheoLiveDistributionEvent(TheoLiveEventType.DISTRIBUTION_LOAD_START, nativeEvent.distributionId ?? '');
    case TheoLiveEventType.DISTRIBUTION_LOADED:
      return new DefaultTheoLiveDistributionLoadedEvent(TheoLiveEventType.DISTRIBUTION_LOADED, nativeEvent.distribution ?? undefined);
    case TheoLiveEventType.DISTRIBUTION_OFFLINE:
      return new DefaultTheoLiveDistributionEvent(TheoLiveEventType.DISTRIBUTION_OFFLINE, nativeEvent.distributionId ?? '');
    case TheoLiveEventType.ENDPOINT_LOADED:
      return new DefaultTheoLiveEndpointLoadedEvent(TheoLiveEventType.ENDPOINT_LOADED, nativeEvent.endpoint);
    case TheoLiveEventType.INTENT_TO_FALLBACK:
      return new DefaultTheoLiveIntentToFallbackEvent(TheoLiveEventType.INTENT_TO_FALLBACK, nativeEvent.reason);
    default:
      return new DefaultTheoLiveEvent(event.type as TheoLiveEventType);
  }
}
