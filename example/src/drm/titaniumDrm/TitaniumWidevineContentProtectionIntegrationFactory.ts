import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'THEOplayer';
import { TitaniumWidevineContentProtectionIntegration } from './TitaniumWidevineContentProtectionIntegration';
import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';

export class TitaniumWidevineContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: TitaniumDrmConfiguration): ContentProtectionIntegration {
    return new TitaniumWidevineContentProtectionIntegration(configuration);
  }
}
