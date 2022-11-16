import type { DRMConfiguration } from 'react-native-theoplayer';

/**
 * The identifier of the Ezdrm integration.
 */
export type EzdrmIntegrationID = 'ezdrmCustom';

/**
 * Describes the configuration of the Ezdrm DRM integration.
 *
 * ```
 * const drmConfiguration = {
 *      integration : 'ezdrm',
 *      fairplay: {
 *          certificateURL: 'yourEzdrmCertificateUrl',
 *          licenseAcquisitionURL: 'yourEzdrmLicenseAcquisitionURL'
 *      }
 * }
 * ```
 */
export interface EzdrmDrmConfiguration extends DRMConfiguration {
  /**
   * The identifier of the DRM integration.
   */
  integration: EzdrmIntegrationID;
}
