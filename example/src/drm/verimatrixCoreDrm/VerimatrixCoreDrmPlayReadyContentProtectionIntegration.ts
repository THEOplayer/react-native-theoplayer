import type { ContentProtectionIntegration, LicenseRequest, MaybeAsync } from 'react-native-theoplayer';
import type { VerimatrixCoreDrmConfiguration } from './VerimatrixCoreDrmConfiguration';

export class VerimatrixCoreDrmPlayReadyContentProtectionIntegration implements ContentProtectionIntegration {
  private readonly contentProtectionConfiguration: VerimatrixCoreDrmConfiguration;

  constructor(configuration: VerimatrixCoreDrmConfiguration) {
    this.contentProtectionConfiguration = configuration;
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
