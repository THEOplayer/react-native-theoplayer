import type { ContentProtectionIntegration } from './ContentProtectionIntegration';
import type { DRMConfiguration } from 'react-native-theoplayer';

/**
 * Factory pattern to create {@link ContentProtectionIntegration}s.
 *
 * @category Content Protection
 * @public
 */
export interface ContentProtectionIntegrationFactory {
  /**
   * Build a new {@link ContentProtectionIntegration} based on the given {@link DRMConfiguration}.
   *
   * @param configuration - The {@link DRMConfiguration} of the currently loading source.
   */
  build(configuration: DRMConfiguration): ContentProtectionIntegration;
}
