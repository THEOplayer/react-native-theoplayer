import type { TypedSource } from '../../SourceDescription';
import type { ServerSideAdInsertionConfiguration } from './ServerSideAdInsertionConfiguration';

/**
 * The identifier of the Imagine integration.
 *
 * @public
 */
export type ImagineSSAIIntegrationID = 'imagine';

/**
 * Describes the SSAI configuration of the Imagine integration.
 *
 * @public
 */
export interface ImagineServerSideAdInsertionConfiguration extends ServerSideAdInsertionConfiguration {
    /**
     * {@inheritDoc ServerSideAdInsertionConfiguration.integration}
     */
    integration: ImagineSSAIIntegrationID;
}

/**
 * Describes a source of the Imagine integration.
 *
 * @public
 */
export interface ImagineTypedSource extends TypedSource {
    ssai: ImagineServerSideAdInsertionConfiguration;
}
