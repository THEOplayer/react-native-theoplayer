import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'react-native-theoplayer';
import type { VerimatrixCoreDrmConfiguration } from './VerimatrixCoreDrmConfiguration';
import { VerimatrixCoreDrmPlayReadyContentProtectionIntegration } from './VerimatrixCoreDrmPlayReadyContentProtectionIntegration';

export class VerimatrixCoreDrmPlayReadyContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: VerimatrixCoreDrmConfiguration): ContentProtectionIntegration {
    return new VerimatrixCoreDrmPlayReadyContentProtectionIntegration(configuration);
  }
}
