import { TheoLiveDistribution } from './TheoLiveDistribution';
import { WebrtcOptions } from './WebrtcOptions';

export interface EndpointMillicastSource {
  name: string;
  accountId: string;
  subscriberToken?: string;
  directorUrl?: string;
  webrtc?: WebrtcOptions
}

/**
 * Description of a THEOlive Endpoint.
 *
 * @category THEOlive
 * @platform android,ios,web
 * @public
 */
export interface TheoLiveEndpoint {
  /**
   * The source of this endpoint.
   *
   * @remarks
   * For most endpoint types, this is the source URL string.
   * For millicast endpoints, this is a {@link EndpointMillicastSource} object.
   *
   * @platform web
   */
  src?: string | EndpointMillicastSource;

  /**
   * The type of source (e.g. 'hesp', 'hls', 'hlsMpegTs', 'millicast', 'dai').
   *
   * @platform web
   */
  srcType?: string;

  /**
   * The provider of this endpoint (e.g. 'optiview').
   *
   * @platform web
   */
  provider?: string;

  millicastSrc?: EndpointMillicastSource;
  hespSrc?: string;
  hlsSrc?: string;
  hlsMpegTsSrc?: string;
  adSrc?: string;
  daiAssetKey?: string;

  cdn?: string;

  /**
   * The target latency for this endpoint, in seconds.
   *
   * @platform android
   */
  targetLatency?: number;

  weight: number;
  priority: number;
  contentProtection?: ChannelDrmConfigResponse;

  /**
   * The distribution associated with this endpoint.
   *
   * @platform web
   */
  distribution?: TheoLiveDistribution;
}

/**
 * Description of a channel's content protection configuration.
 */
export interface ChannelDrmConfigResponse {
  integration: string;
  widevine?: {
    licenseUrl: string;
  };
  playready?: {
    licenseUrl: string;
  };
  fairplay?: {
    licenseUrl: string;
    certificateUrl: string;
  };
}
