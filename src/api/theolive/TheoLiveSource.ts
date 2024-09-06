import { SourceIntegrationId, TypedSource } from 'react-native-theoplayer';

/**
 * Represents a source for the THEOlive integration.
 *
 * @category Source
 * @public
 */
export interface TheoLiveSource extends TypedSource {
    integration: SourceIntegrationId.THEO_LIVE;
}
