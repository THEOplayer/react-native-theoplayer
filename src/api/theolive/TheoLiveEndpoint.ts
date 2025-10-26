export interface EndpointMillicastSource {
  name: string;
  accountId: string;
  subscriberToken?: string;
  directorUrl?: string;
}

/**
 * Description of a THEOlive Endpoint.
 *
 * @category THEOlive
 * @platform android,web
 * @public
 */
export interface TheoLiveEndpoint {
  millicastSrc?: EndpointMillicastSource;
  hespSrc?: string;
  hlsSrc?: string;
  adSrc?: string;
  cdn?: string;
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
