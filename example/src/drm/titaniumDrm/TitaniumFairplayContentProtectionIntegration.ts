import { isTitaniumDRMConfiguration } from './TitaniumUtils';
import { createTitaniumHeaders, TitaniumCDMType } from './TitaniumBaseRegistration';
import type { ContentProtectionIntegration, LicenseRequest, MaybeAsync } from 'react-native-theoplayer';
import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';

export class TitaniumFairplayContentProtectionIntegration implements ContentProtectionIntegration {
  private readonly contentProtectionConfiguration: TitaniumDrmConfiguration;

  constructor(drmConfiguration: TitaniumDrmConfiguration) {
    if (!isTitaniumDRMConfiguration(drmConfiguration)) {
      throw new Error('Titanium DRM has not been correctly configured.');
    }
    this.contentProtectionConfiguration = drmConfiguration;
  }

  onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    request.headers = {
      ...request.headers,
      ...createTitaniumHeaders(this.contentProtectionConfiguration, TitaniumCDMType.FAIRPLAY),
    };
    return request;
  }

  extractFairplayContentId(skdUrl: string): MaybeAsync<string> {
    // drop the 'skd://' part
    return skdUrl.substring(6, skdUrl.length);
  }
}
