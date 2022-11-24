import type { CertificateRequest, ContentProtectionIntegration, LicenseRequest, MaybeAsync } from 'react-native-theoplayer';
import type { VerimatrixCoreDrmConfiguration } from './VerimatrixCoreDrmConfiguration';

export class VerimatrixCoreDrmWidevineContentProtectionIntegration implements ContentProtectionIntegration {
  private readonly contentProtectionConfiguration: VerimatrixCoreDrmConfiguration;

  constructor(configuration: VerimatrixCoreDrmConfiguration) {
    this.contentProtectionConfiguration = configuration;
  }

  onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
    request.headers = {
      ...request.headers,
      'content-type': 'application/octet-stream',
      Authorization: this.contentProtectionConfiguration.integrationParameters.drmToken ?? '',
    };
    return request;
  }

  onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    request.headers = {
      ...request.headers,
      'content-type': 'application/octet-stream',
      Authorization: this.contentProtectionConfiguration.integrationParameters.drmToken ?? '',
    };
    return request;
  }
}
