import type { CertificateRequest, ContentProtectionIntegration, LicenseRequest, MaybeAsync } from 'react-native-theoplayer';
import type { VerimatrixCoreDrmConfiguration } from './VerimatrixCoreDrmConfiguration';
import { createTitaniumHeaders, TitaniumCDMType } from '../titaniumDrm/TitaniumBaseRegistration';

export class VerimatrixCoreDrmWidevineContentProtectionIntegration implements ContentProtectionIntegration {
  static readonly DEFAULT_CERTIFICATE_URL = 'insert default certificate url here';
  static readonly DEFAULT_LICENSE_URL = 'insert default license url here';

  private readonly contentProtectionConfiguration: VerimatrixCoreDrmConfiguration;

  constructor(configuration: VerimatrixCoreDrmConfiguration) {
    this.contentProtectionConfiguration = configuration;
  }

  onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
    console.log('VerimatrixCoreDrmWidevineContentProtectionIntegration onCertificateRequest triggered');
    request.headers = {
      ...request.headers,
      'content-type': 'application/octet-stream',
      Authorization: this.contentProtectionConfiguration.integrationParameters.drmToken ?? '',
    };
    return request;
  }

  onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    console.log('VerimatrixCoreDrmWidevineContentProtectionIntegration onLicenseRequest triggered');
    request.headers = {
      ...request.headers,
      'content-type': 'application/octet-stream',
      Authorization: this.contentProtectionConfiguration.integrationParameters.drmToken ?? '',
    };
    return request;
  }
}
