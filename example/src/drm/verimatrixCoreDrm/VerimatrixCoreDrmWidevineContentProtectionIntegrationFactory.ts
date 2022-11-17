import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'react-native-theoplayer';
import type { VerimatrixCoreDrmConfiguration } from './VerimatrixCoreDrmConfiguration';
import { VerimatrixCoreDrmWidevineContentProtectionIntegration } from './VerimatrixCoreDrmWidevineContentProtectionIntegration';

export class VerimatrixCoreDrmWidevineContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: VerimatrixCoreDrmConfiguration): ContentProtectionIntegration {
    return new VerimatrixCoreDrmWidevineContentProtectionIntegration(configuration);
  }
}
