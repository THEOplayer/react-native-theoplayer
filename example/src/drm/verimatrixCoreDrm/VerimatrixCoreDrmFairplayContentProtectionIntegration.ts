import type { CertificateRequest, ContentProtectionIntegration, LicenseRequest, MaybeAsync } from 'react-native-theoplayer';
import type { VerimatrixCoreDrmConfiguration } from './VerimatrixCoreDrmConfiguration';
import { fromObjectToUint8Array, fromUint8ArrayToBase64String } from 'react-native-theoplayer';

export class VerimatrixCoreDrmFairplayContentProtectionIntegration implements ContentProtectionIntegration {
  static readonly DEFAULT_CERTIFICATE_URL = 'insert default certificate url here';
  static readonly DEFAULT_LICENSE_URL = 'insert default license url here';

  private readonly contentProtectionConfiguration: VerimatrixCoreDrmConfiguration;

  constructor(configuration: VerimatrixCoreDrmConfiguration) {
    this.contentProtectionConfiguration = configuration;
  }

  onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
    console.log('VerimatrixCoreDrmFairplayContentProtectionIntegration onCertificateRequest triggered');
    request.headers = {
      ...request.headers,
      'content-type': 'application/octet-stream',
      Authorization: this.contentProtectionConfiguration.integrationParameters.drmToken ?? '',
    };
    return request;
  }

  onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    console.log('VerimatrixCoreDrmFairplayContentProtectionIntegration onLicenseRequest triggered');
    const spcMessage = fromUint8ArrayToBase64String(request.body!);
    const bodyObject = {
      spc: spcMessage,
    };
    const bodyData = fromObjectToUint8Array(bodyObject);
    request.url =
      this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL ??
      VerimatrixCoreDrmFairplayContentProtectionIntegration.DEFAULT_LICENSE_URL;
    request.headers = {
      ...request.headers,
      'content-type': 'application/octet-stream',
      Authorization: this.contentProtectionConfiguration.integrationParameters.drmToken ?? '',
    };
    request.body = bodyData;
    return request;
  }

  extractFairplayContentId(skdUrl: string): string {
    // drop params in url
    const chunks = skdUrl.split('?');
    const sdkUrlWithoutParams = chunks[0];
    // drop the 'skd://' part
    return sdkUrlWithoutParams.substring(6, skdUrl.length);
  }
}
