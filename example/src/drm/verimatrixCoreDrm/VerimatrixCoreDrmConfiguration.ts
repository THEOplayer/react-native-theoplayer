import type { DRMConfiguration } from 'react-native-theoplayer';
import type { VerimatrixCoreIntegrationParameters } from './VerimatrixCoreIntegrationParameters';

/**
 * The identifier of the Ezdrm integration.
 */
export type VerimatrixCoreDrmIntegrationID = 'verimatrixcoredrmCustom';

/**
 * Describes the configuration of the Verimatrix Core DRM integration.
 *
 * ```
 * const drmConfiguration = {
 *      integration : 'verimatrixcoredrmCustom',
 *      fairplay: {
 *          certificateURL: 'yourCertificateUrl',
 *          licenseAcquisitionURL: 'yourLicenseAcquisitionURL'
 *      }
 * }
 * ```
 */
export interface VerimatrixCoreDrmConfiguration extends DRMConfiguration {
  /**
   * The identifier of the DRM integration.
   */
  integration: VerimatrixCoreDrmIntegrationID;

  integrationParameters: VerimatrixCoreIntegrationParameters;
}
