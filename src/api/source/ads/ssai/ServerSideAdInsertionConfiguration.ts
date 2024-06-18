import type { GoogleDAISSAIIntegrationID } from './GoogleDAIConfiguration';

/**
 * The identifier of a server-side ad insertion pre-integration, represented by a string value.
 *
 * @public
 */
export type SSAIIntegrationId = GoogleDAISSAIIntegrationID | CustomSSAIIntegrationId;
export type CustomSSAIIntegrationId = string;

/**
 * Represents a configuration for server-side ad insertion (SSAI).
 *
 * @public
 */
export interface ServerSideAdInsertionConfiguration {
    /**
     * The identifier for the SSAI integration.
     */
    integration: SSAIIntegrationId;
}
