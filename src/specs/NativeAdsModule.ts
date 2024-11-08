import { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { type Ad, AdBreak } from 'react-native-theoplayer';
import { Int32, Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  playing(tag: Int32): Promise<boolean>;

  skip(tag: Int32): void;

  currentAdBreak(tag: Int32): Promise<AdBreak>;

  currentAds(tag: Int32): Promise<Ad[]>;

  scheduledAdBreaks(tag: Int32): Promise<AdBreak[]>;

  schedule(
    tag: Int32,
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

  daiContentTimeForStreamTime(tag: Int32, time: Double): Promise<Double>;

  daiStreamTimeForContentTime(tag: Int32, time: Double): Promise<Double>;

  daiSnapback(tag: Int32): Promise<boolean>;

  daiSetSnapback(tag: Int32, enabled: boolean): void;

  /* Omid API */

  addFriendlyObstruction(
    tag: Int32,
    obstruction: {
      view: Int32;
      purpose: string;
      reason?: string;
    },
  ): void;

  removeAllFriendlyObstructions(tag: Int32): void;
}

export default TurboModuleRegistry?.getEnforcing<Spec>('THEORCTAdsModule');
