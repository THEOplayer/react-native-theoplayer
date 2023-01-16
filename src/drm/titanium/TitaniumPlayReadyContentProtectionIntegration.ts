import type {
  BufferSource,
  CertificateRequest,
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

export class TitaniumPlayReadyContentProtectionIntegration
  implements ContentProtectionIntegration
{
  private readonly contentProtectionConfiguration: TitaniumDrmConfiguration;

  constructor(drmConfiguration: TitaniumDrmConfiguration) {
    if (!isTitaniumDRMConfiguration(drmConfiguration)) {
      throw new Error('Titanium DRM has not been correctly configured.');
    }
    this.contentProtectionConfiguration = drmConfiguration;
  }

  onCertificateRequest(
    request: CertificateRequest,
  ): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
    request.headers = {
      ...request.headers,
      ...createTitaniumHeaders(
        this.contentProtectionConfiguration,
        TitaniumCDMType.PLAYREADY_v3,
      ),
    };
    return request;
  }

  onLicenseRequest(
    request: LicenseRequest,
  ): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    request.headers = {
      ...request.headers,
      ...createTitaniumHeaders(
        this.contentProtectionConfiguration,
        TitaniumCDMType.PLAYREADY_v3,
      ),
    };
    return request;
  }
}
