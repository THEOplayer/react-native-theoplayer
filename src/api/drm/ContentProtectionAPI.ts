import type { KeySystemId } from '@wouterds/react-native-theoplayer';
import type { ContentProtectionIntegrationFactory } from './ContentProtectionIntegrationFactory';

export interface ContentProtectionAPI {
  registerContentProtectionIntegration(integrationId: string, keySystem: KeySystemId, integrationFactory: ContentProtectionIntegrationFactory): void;
}
