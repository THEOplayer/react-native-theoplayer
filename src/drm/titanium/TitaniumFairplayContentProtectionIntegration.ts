import type {
  BufferSource,
  ContentProtectionIntegration,
  LicenseRequest,
  MaybeAsync,
} from '@wouterds/react-native-theoplayer';

import {
  createTitaniumHeaders,
  TitaniumCDMType,
} from './TitaniumBaseRegistration';
import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';
import { isTitaniumDRMConfiguration } from './TitaniumUtils';

export class TitaniumFairplayContentProtectionIntegration
  implements ContentProtectionIntegration
{
  private readonly contentProtectionConfiguration: TitaniumDrmConfiguration;

  constructor(drmConfiguration: TitaniumDrmConfiguration) {
    if (!isTitaniumDRMConfiguration(drmConfiguration)) {
      throw new Error('Titanium DRM has not been correctly configured.');
    }
    this.contentProtectionConfiguration = drmConfiguration;
  }

  onLicenseRequest(
    request: LicenseRequest,
  ): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    request.headers = {
      ...request.headers,
      ...createTitaniumHeaders(
        this.contentProtectionConfiguration,
        TitaniumCDMType.FAIRPLAY,
      ),
    };
    return request;
  }

  extractFairplayContentId(skdUrl: string): MaybeAsync<string> {
    // drop the 'skd://' part
    console.log(skdUrl);
    return skdUrl.substring(6, skdUrl.length);
  }
}
