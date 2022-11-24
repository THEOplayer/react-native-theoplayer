import type { ContentProtectionIntegration, LicenseRequest, LicenseResponse, MaybeAsync } from 'react-native-theoplayer';
import type { VerimatrixCoreDrmConfiguration } from './VerimatrixCoreDrmConfiguration';
import { fromBase64StringToUint8Array, fromObjectToUint8Array, fromUint8ArrayToBase64String, fromUint8ArrayToObject } from 'react-native-theoplayer';

export class VerimatrixCoreDrmFairplayContentProtectionIntegration implements ContentProtectionIntegration {
  static readonly DEFAULT_LICENSE_URL = 'insert default license url here';

  private readonly contentProtectionConfiguration: VerimatrixCoreDrmConfiguration;

  constructor(configuration: VerimatrixCoreDrmConfiguration) {
    this.contentProtectionConfiguration = configuration;
  }

  onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    const spcMessage = fromUint8ArrayToBase64String(request.body!);
    const bodyObject = {
      spc: spcMessage,
    };
    const bodyData = fromObjectToUint8Array(bodyObject);
    request.url =
      this.contentProtectionConfiguration.fairplay?.licenseAcquisitionURL ??
      VerimatrixCoreDrmFairplayContentProtectionIntegration.DEFAULT_LICENSE_URL;
    request.headers = {
      'content-type': 'application/json',
      Authorization: this.contentProtectionConfiguration.integrationParameters.drmToken ?? '',
    };
    request.body = bodyData;
    return request;
  }

  onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource> {
    const responseObject = fromUint8ArrayToObject(response.body);
    return fromBase64StringToUint8Array(responseObject.ckc);
  }

  extractFairplayContentId(skdUrl: string): string {
    // drop params in url
    const chunks = skdUrl.split('?');
    const sdkUrlWithoutParams = chunks[0];
    // drop the 'skd://' part
    return sdkUrlWithoutParams.substring(6, sdkUrlWithoutParams.length);
  }
}
