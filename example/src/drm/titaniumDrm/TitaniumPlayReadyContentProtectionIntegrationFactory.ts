import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';
import { TitaniumPlayReadyContentProtectionIntegration } from './TitaniumPlayReadyContentProtectionIntegration';
import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'react-native-theoplayer';

export class TitaniumPlayReadyContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: TitaniumDrmConfiguration): ContentProtectionIntegration {
    return new TitaniumPlayReadyContentProtectionIntegration(configuration);
  }
}
