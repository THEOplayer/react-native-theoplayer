import type { TypedSource } from '../../SourceDescription';
import type { ServerSideAdInsertionConfiguration } from './ServerSideAdInsertionConfiguration';

/**
 * The identifier of the Google DAI integration.
 *
 * @public
 */
export type GoogleDAISSAIIntegrationID = 'google-dai';

/**
 * The type of the stream requested from Google DAI, represented by a value from the following list:
 * <br/> - `'live'`: The requested stream is a live stream.
 * <br/> - `'vod'`: The requested stream is a video-on-demand stream.
 *
 * @public
 */
export type DAIAvailabilityType = 'vod' | 'live';

/**
 * Represents a configuration for server-side ad insertion with the Google DAI pre-integration.
 *
 * @remarks
 * <br/> - Available since v2.30.0.
 *
 * @public
 */
export interface GoogleDAIConfiguration extends ServerSideAdInsertionConfiguration {
    /**
     * The type of the requested stream.
     */
    readonly availabilityType?: DAIAvailabilityType;

    /**
     * The identifier for the SSAI pre-integration.
     */
    integration: GoogleDAISSAIIntegrationID;

    /**
     * The authorization token for the stream request.
     *
     * @remarks
     * <br/> - If present, this token is used instead of the API key for stricter content authorization.
     * <br/> - The publisher can control individual content streams authorizations based on this token.
     */
    authToken?: string;

    /**
     * The API key for the stream request.
     *
     * @remarks
     * <br/> - This key is used to verify applications that are attempting to access the content.
     * <br/> - This key is configured through the Google Ad Manager UI.
     */
    apiKey: string;

    /**
     * The ad tag parameters added to stream request.
     *
     * @remarks
     * <br/> - Each entry contains the parameter name with associated value.
     *
     * Valid parameters:
     * <br/> - {@link https://support.google.com/admanager/answer/7320899 | Supply targeting parameters to your stream}
     * <br/> - {@link https://support.google.com/admanager/answer/7320898 | Override stream variant parameters}
     */
    adTagParameters?: Record<string, string>;

    /**
     * The identifier for a stream activity monitor session.
     */
    streamActivityMonitorID?: string;
}

/**
 * Represents a configuration for server-side ad insertion with the Google DAI pre-integration for a Live media stream.
 *
 * @remarks
 * <br/> - Available since v2.30.0.
 *
 * @public
 */
export interface GoogleDAILiveConfiguration extends GoogleDAIConfiguration {
    /**
     * The type of the requested stream.
     */
    readonly availabilityType: 'live';

    /**
     * The identifier for the video content source for live streams.
     *
     * @remarks
     * <br/> - This property is required for live streams.
     * <br/> - The asset key can be found in the Google Ad Manager UI.
     */
    assetKey: string;
}

/**
 * Represents a configuration for server-side ad insertion with the Google DAI pre-integration for a VOD media stream.
 *
 * @remarks
 * <br/> - Available since v2.30.0.
 *
 * @public
 */
export interface GoogleDAIVodConfiguration extends GoogleDAIConfiguration {
    /**
     * The type of the requested stream.
     */
    readonly availabilityType: 'vod';

    /**
     * The identifier for the publisher content for on-demand streams.
     *
     * @remarks
     * <br/> - The publisher content comes from a CMS.
     * <br/> - This property is required for on-demand streams.
     */
    contentSourceID: string;

    /**
     * The identifier for the video content source for on-demand streams.
     *
     * @remarks
     * <br/> - This property is required for on-demand streams.
     */
    videoID: string;
}

/**
 * Represents a media resource with a Google DAI server-side ad insertion request.
 *
 * @public
 */
export interface GoogleDAITypedSource extends TypedSource {
    /**
     * The content type (MIME type) of the media resource, represented by a value from the following list:
     * <br/> - `'application/dash+xml'`: The media resource is an MPEG-DASH stream.
     * <br/> - `'application/x-mpegURL'` or `'application/vnd.apple.mpegurl'`: The media resource is an HLS stream.
     */
    type: string;

    ssai: GoogleDAIVodConfiguration | GoogleDAILiveConfiguration;
}
