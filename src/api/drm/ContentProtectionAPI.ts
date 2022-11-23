import type { KeySystemId } from 'react-native-theoplayer';
import type { ContentProtectionIntegrationFactory } from './ContentProtectionIntegrationFactory';

export interface ContentProtectionAPI {
  registerContentProtectionIntegration(integrationId: string, keySystem: KeySystemId, integrationFactory: ContentProtectionIntegrationFactory): void;
}
