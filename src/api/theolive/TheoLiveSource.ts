import { SourceIntegrationId, TypedSource } from 'react-native-theoplayer';

/**
 * Represents a source for the THEOlive integration.
 *
 * @category Source
 * @public
 */
export interface TheoLiveSource extends TypedSource {
    /**
     * @deprecated use {@link TypedSource.type} instead.
     */
    integration: SourceIntegrationId.THEO_LIVE;

    /**
     * The content type.
     */
    type: 'theolive';

    /**
     * The profile identifier is included as a query parameter in the discovery request to obtain a response specific to that profile.
     */
    profile?: string;

    /**
     * WebRTC configuration for a THEOlive Millicast source.
     */
    webrtc?: Record<string, any>
}
