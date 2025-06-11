import type { GoogleDAISSAIIntegrationID } from './GoogleDAIConfiguration';

/**
 * The identifier of a server-side ad insertion pre-integration, represented by a string value.
 *
 * @category Ads
 * @category SSAI
 * @public
 */
export type SSAIIntegrationId = GoogleDAISSAIIntegrationID | CustomSSAIIntegrationId;

/**
 * The identifier of a custom server-side ad insertion, represented by a string value.
 *
 * @category Ads
 * @category SSAI
 * @public
 */
export type CustomSSAIIntegrationId = string;

/**
 * Represents a configuration for server-side ad insertion (SSAI).
 *
 * @category Ads
 * @category SSAI
 * @public
 */
export interface ServerSideAdInsertionConfiguration {
    /**
     * The identifier for the SSAI integration.
     */
    integration: SSAIIntegrationId;
}
