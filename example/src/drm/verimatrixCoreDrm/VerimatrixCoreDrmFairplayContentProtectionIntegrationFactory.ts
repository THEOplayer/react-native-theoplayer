import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'react-native-theoplayer';
import type { VerimatrixCoreDrmConfiguration } from './VerimatrixCoreDrmConfiguration';
import { VerimatrixCoreDrmFairplayContentProtectionIntegration } from './VerimatrixCoreDrmFairplayContentProtectionIntegration';

export class VerimatrixCoreDrmFairplayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: VerimatrixCoreDrmConfiguration): ContentProtectionIntegration {
    return new VerimatrixCoreDrmFairplayContentProtectionIntegration(configuration);
  }
}
