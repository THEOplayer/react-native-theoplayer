import type { CertificateRequest, ContentProtectionIntegration, LicenseRequest, MaybeAsync } from 'react-native-theoplayer';
import type { EzdrmDrmConfiguration } from './EzDrmConfiguration';

export class EzdrmFairplayContentProtectionIntegration implements ContentProtectionIntegration {
  static readonly DEFAULT_CERTIFICATE_URL = 'insert default certificate url here';
  static readonly DEFAULT_LICENSE_URL = 'insert default license url here';

  private readonly contentProtectionConfiguration: EzdrmDrmConfiguration;
  private contentId: string | undefined = undefined;

  constructor(configuration: EzdrmDrmConfiguration) {
    this.contentProtectionConfiguration = configuration;
  }

  onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
    request.url = this.contentProtectionConfiguration.fairplay?.certificateURL ?? EzdrmFairplayContentProtectionIntegration.DEFAULT_CERTIFICATE_URL;
    request.headers = {
      ...request.headers,
      'content-type': 'application/octet-stream',
    };
    return request;
  }

  onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    request.url =
      this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL ?? EzdrmFairplayContentProtectionIntegration.DEFAULT_LICENSE_URL;
    request.headers = {
      ...request.headers,
      'content-type': 'application/octet-stream',
    };
    return request;
  }

  extractFairplayContentId(skdUrl: string): string {
    const questionMarkIndex = skdUrl.indexOf('?');
    if (questionMarkIndex >= 0) {
      this.contentId = skdUrl.substr(questionMarkIndex + 1);
    } else {
      const chunks = skdUrl.split(';');
      this.contentId = chunks[chunks.length - 1];
    }
    return this.contentId;
  }
}
