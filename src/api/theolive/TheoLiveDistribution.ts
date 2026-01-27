import { TheoLiveEndpoint } from 'react-native-theoplayer';

/**
 * A THEOlive distribution.
 *
 * @category THEOlive
 * @public
 */
export interface TheoLiveDistribution {
  id: string;
  name: string;
  targetLatency?: number;
  maxBitrate?: number;
  endpoints: TheoLiveEndpoint[];
  dvrWindowSeconds?: number;
}
