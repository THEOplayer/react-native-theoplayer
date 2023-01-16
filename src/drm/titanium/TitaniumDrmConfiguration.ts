import type { DRMConfiguration } from '@wouterds/react-native-theoplayer';

import type { TitaniumIntegrationParameters } from './TitaniumIntegrationParameters';

export type TitaniumIntegrationID = 'titaniumdrmCustom';

export interface TitaniumDrmConfiguration extends DRMConfiguration {
  integration: TitaniumIntegrationID;

  integrationParameters: TitaniumIntegrationParameters;
}
