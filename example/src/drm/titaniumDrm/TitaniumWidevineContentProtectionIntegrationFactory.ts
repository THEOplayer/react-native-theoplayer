import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';
import { TitaniumWidevineContentProtectionIntegration } from './TitaniumWidevineContentProtectionIntegration';
import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'react-native-theoplayer';

export class TitaniumWidevineContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: TitaniumDrmConfiguration): ContentProtectionIntegration {
    return new TitaniumWidevineContentProtectionIntegration(configuration);
  }
}
