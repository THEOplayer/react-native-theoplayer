/**
 * Description of a THEOlive Endpoint.
 *
 * @category THEOlive
 * @platform android,web
 * @public
 */
export interface TheoLiveEndpoint {
  hespSrc?: string;
  hlsSrc?: string;
  adSrc?: string;
  weight: number;
  priority: number;
  contentProtection?: ChannelDrmConfigResponse;
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
