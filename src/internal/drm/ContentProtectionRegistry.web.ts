import type { ContentProtectionAPI, ContentProtectionIntegrationFactory, KeySystemId } from 'react-native-theoplayer';
import { registerContentProtectionIntegration } from 'theoplayer';

export class WebContentProtectionRegistry implements ContentProtectionAPI {
  registerContentProtectionIntegration(integrationId: string, keySystem: KeySystemId, integrationFactory: ContentProtectionIntegrationFactory): void {
    registerContentProtectionIntegration(integrationId, keySystem, integrationFactory);
  }
}

export const ContentProtectionRegistry = new WebContentProtectionRegistry();
