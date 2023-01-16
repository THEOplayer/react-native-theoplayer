import type { ContentProtectionIntegration } from './ContentProtectionIntegration';
import type { DRMConfiguration } from '@wouterds/react-native-theoplayer';

/**
 * Factory pattern to create {@link ContentProtectionIntegration}s.
 *
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
