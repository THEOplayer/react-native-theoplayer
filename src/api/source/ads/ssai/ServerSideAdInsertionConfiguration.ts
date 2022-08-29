import type { YospaceSSAIIntegrationID } from './YospaceServerSideAdInsertionConfiguration';
import type { GoogleDAISSAIIntegrationID } from './GoogleDAIConfiguration';
import type { ImagineSSAIIntegrationID } from './ImagineServerSideAdInsertionConfiguration';

/**
 * The identifier of a server-side ad insertion pre-integration, represented by a value from the following list:
 * <br/> - `'yospace'`: The configuration with this identifier is a {@link YospaceServerSideAdInsertionConfiguration}
 * <br/> - `'google-dai'`: The configuration with this identifier is a {@link GoogleDAIConfiguration}
 * <br/> - `'imagine'`: The configuration with this identifier is a {@link ImagineServerSideAdInsertionConfiguration}
 *
 * @public
 */
export type SSAIIntegrationId = YospaceSSAIIntegrationID | GoogleDAISSAIIntegrationID | ImagineSSAIIntegrationID;

/**
 * Represents a configuration for server-side ad insertion (SSAI).
 *
 * @remarks
 * <br/> - Available since v2.12.0.
 *
 * @public
 */
export interface ServerSideAdInsertionConfiguration {
    /**
     * The identifier for the SSAI integration.
     */
    integration: SSAIIntegrationId;
}
