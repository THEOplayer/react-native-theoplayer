import type { ContentProtectionAPI, ContentProtectionIntegrationFactory, KeySystemId } from 'react-native-theoplayer';
import { registerContentProtectionIntegration } from 'theoplayer';

export class WebContentProtectionAPI implements ContentProtectionAPI {
  registerContentProtectionIntegration(integrationId: string, keySystem: KeySystemId, integrationFactory: ContentProtectionIntegrationFactory): void {
    registerContentProtectionIntegration(integrationId, keySystem, integrationFactory);
  }
}

export const ContentProtectionIntegrationAPI = new WebContentProtectionAPI();
