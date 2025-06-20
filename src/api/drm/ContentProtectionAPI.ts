import type { KeySystemId } from 'react-native-theoplayer';
import type { ContentProtectionIntegrationFactory } from './ContentProtectionIntegrationFactory';

/**
 * The Content Protection API.
 *
 * @category Content Protection
 * @public
 */
export interface ContentProtectionAPI {

  /**
   * Register a content protection integration
   */
  registerContentProtectionIntegration(integrationId: string, keySystem: KeySystemId, integrationFactory: ContentProtectionIntegrationFactory): void;
}
