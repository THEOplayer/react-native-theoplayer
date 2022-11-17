import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'THEOplayer';
import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';
import { TitaniumPlayReadyContentProtectionIntegration } from './TitaniumPlayReadyContentProtectionIntegration';

export class TitaniumPlayReadyContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: TitaniumDrmConfiguration): ContentProtectionIntegration {
    return new TitaniumPlayReadyContentProtectionIntegration(configuration);
  }
}
