import {
  ContentProtectionIntegration,
  ContentProtectionIntegrationFactory,
} from '@wouterds/react-native-theoplayer';

import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';
import { TitaniumFairplayContentProtectionIntegration } from './TitaniumFairplayContentProtectionIntegration';

export class TitaniumFairplayContentProtectionIntegrationFactory
  implements ContentProtectionIntegrationFactory
{
  build(configuration: TitaniumDrmConfiguration): ContentProtectionIntegration {
    return new TitaniumFairplayContentProtectionIntegration(configuration);
  }
}
