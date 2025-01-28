import { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { type Ad, AdBreak } from 'react-native-theoplayer';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  playing(tag: Double): Promise<boolean>;

  skip(tag: Double): void;

  currentAdBreak(tag: Double): Promise<AdBreak>;

  currentAds(tag: Double): Promise<Ad[]>;

  scheduledAdBreaks(tag: Double): Promise<AdBreak[]>;

  schedule(
    tag: Double,
    ad: {
      integration?: string;
      sources?: {
        src: string;
        type?: string;
      };
      timeOffset?: Double;
    },
  ): void;

  /* GoogleDAI API */

  daiContentTimeForStreamTime(tag: Double, time: Double): Promise<Double>;

  daiStreamTimeForContentTime(tag: Double, time: Double): Promise<Double>;

  daiSnapback(tag: Double): Promise<boolean>;

  daiSetSnapback(tag: Double, enabled: boolean): void;

  /* Omid API */

  addFriendlyObstruction(
    tag: Double,
    obstruction: {
      view: Double;
      purpose: string;
      reason?: string;
    },
  ): void;

  removeAllFriendlyObstructions(tag: Double): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTAdsModule') : undefined;
