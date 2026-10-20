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
   * Undefined if the endpoint has no source.
   *
   * @platform android,ios,web
   */
  src?: string | EndpointMillicastSource;

  /**
   * The type of source (e.g. 'hesp', 'hls', 'hlsMpegTs', 'millicast', 'dai').
   *
   * @remarks
   * Undefined if the endpoint has no source.
   *
   * @platform android,ios,web
   */
  srcType?: string;

  /**
   * The provider of this endpoint (e.g. 'optiview', 'mediakind').
   *
   * @remarks
   * Unknown providers are reported verbatim. Undefined if the discovery response does not specify one.
   *
   * @platform android,ios,web
   */
  provider?: string;

  /**
   * The ad system associated with this endpoint (e.g. 'sgai', 'mediakind', 'dai').
   *
   * @remarks
   * Unknown ad systems are reported verbatim. Only populated for V3 distributions; undefined otherwise.
   *
   * @platform android,ios,web
   */
  adSystem?: string;

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
