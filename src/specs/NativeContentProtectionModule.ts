/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  registerContentProtectionIntegration(integrationId: string, keySystemId: string): void;

  onBuildProcessed(payload: { requestId: string; resultString: string }): void;

  onCertificateRequest(payload: Object): void;

  onCertificateRequestProcessedAsCertificate(payload: Object): void;

  onCertificateRequestProcessedAsRequest(payload: Object): void;

  onCertificateResponseProcessed(payload: Object): void;

  onLicenseRequestProcessedAsLicense(payload: Object): void;

  onLicenseRequestProcessedAsRequest(payload: Object): void;

  onLicenseResponseProcessed(payload: Object): void;

  onExtractFairplayContentIdProcessed(payload: Object): void;
}

export default TurboModuleRegistry?.getEnforcing<Spec>('THEORCTContentProtectionModule');