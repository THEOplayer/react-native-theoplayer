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
 * @platform android,web
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
   * The provider of this endpoint (e.g. 'optiview', 'mediakind').
   *
   * @platform web
   */
  provider?: string;

  /**
   * @deprecated Use {@link src} with {@link srcType} `'millicast'` instead. Only populated for V1/V2 distributions.
   */
  millicastSrc?: EndpointMillicastSource;

  /**
   * @deprecated Use {@link src} with {@link srcType} `'hesp'` instead. Only populated for V1/V2 distributions.
   */
  hespSrc?: string;

  /**
   * @deprecated Use {@link src} with {@link srcType} `'hls'` instead. Only populated for V1/V2 distributions.
   */
  hlsSrc?: string;

  /**
   * @deprecated Use {@link src} with {@link srcType} `'hlsMpegTs'` instead. Only populated for V1/V2 distributions.
   */
  hlsMpegTsSrc?: string;

  /**
   * @deprecated Only populated for V1/V2 distributions.
   */
  adSrc?: string;

  /**
   * @deprecated Only populated for V1/V2 distributions.
   */
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
