import { TypedSource } from 'react-native-theoplayer';
import { WebrtcOptions } from './WebrtcOptions';

/**
 * Represents a source for the THEOlive integration.
 *
 * @category Source
 * @public
 */
export interface TheoLiveSource extends TypedSource {
    /**
     * The source URL of the media resource.
     */
    src: string;

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
    webrtc?: WebrtcOptions;
}
