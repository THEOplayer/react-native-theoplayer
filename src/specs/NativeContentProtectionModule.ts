/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  registerContentProtectionIntegration(integrationId: string, keySystemId: string): void;

  onBuildProcessed(payload: Object): void;

  onCertificateRequestProcessedAsCertificate(payload: Object): void;

  onCertificateRequestProcessedAsRequest(payload: Object): void;

  onCertificateResponseProcessed(payload: Object): void;

  onLicenseRequestProcessedAsLicense(payload: Object): void;

  onLicenseRequestProcessedAsRequest(payload: Object): void;

  onLicenseResponseProcessed(payload: Object): void;

  onExtractFairplayContentIdProcessed(payload: Object): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTContentProtectionModule') : undefined;
