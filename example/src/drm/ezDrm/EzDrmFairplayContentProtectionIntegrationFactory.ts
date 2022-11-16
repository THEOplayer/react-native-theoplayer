import type {ContentProtectionIntegration, ContentProtectionIntegrationFactory} from "react-native-theoplayer";
import type {EzdrmDrmConfiguration} from "./EzDrmConfiguration";
import {EzdrmFairplayContentProtectionIntegration} from "./EzDrmFairplayContentProtectionIntegration";

export class EzdrmFairplayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: EzdrmDrmConfiguration): ContentProtectionIntegration {
    return new EzdrmFairplayContentProtectionIntegration(configuration);
  }
}
