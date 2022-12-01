import { TitaniumFairplayContentProtectionIntegration } from './TitaniumFairplayContentProtectionIntegration';
import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';
import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'react-native-theoplayer';

export class TitaniumFairplayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: TitaniumDrmConfiguration): ContentProtectionIntegration {
    return new TitaniumFairplayContentProtectionIntegration(configuration);
  }
}
