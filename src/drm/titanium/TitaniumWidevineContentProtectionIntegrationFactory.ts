import {
  ContentProtectionIntegration,
  ContentProtectionIntegrationFactory,
} from '@wouterds/react-native-theoplayer';

import type { TitaniumDrmConfiguration } from './TitaniumDrmConfiguration';
import { TitaniumWidevineContentProtectionIntegration } from './TitaniumWidevineContentProtectionIntegration';

export class TitaniumWidevineContentProtectionIntegrationFactory
  implements ContentProtectionIntegrationFactory
{
  build(configuration: TitaniumDrmConfiguration): ContentProtectionIntegration {
    return new TitaniumWidevineContentProtectionIntegration(configuration);
  }
}
