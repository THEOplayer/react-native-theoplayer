import { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { type Ad, AdBreak } from 'react-native-theoplayer';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

type ScheduledAd = Readonly<{
  integration?: string;
  sources?: {
    src: string;
    type?: string;
  };
  timeOffset?: Double;
}>;

type FriendlyObstruction = Readonly<{
  view: Double;
  purpose: string;
  reason?: string;
}>;

export interface Spec extends TurboModule {
  playing(tag: Double): Promise<boolean>;

  skip(tag: Double): void;

  currentAdBreak(tag: Double): Promise<AdBreak>;

  currentAds(tag: Double): Promise<Ad[]>;

  scheduledAdBreaks(tag: Double): Promise<AdBreak[]>;

  schedule(tag: Double, ad: ScheduledAd): void;

  /* GoogleDAI API */

  daiContentTimeForStreamTime(tag: Double, time: Double): Promise<Double>;

  daiStreamTimeForContentTime(tag: Double, time: Double): Promise<Double>;

  daiSnapback(tag: Double): Promise<boolean>;

  daiSetSnapback(tag: Double, enabled: boolean): void;

  /* Omid API */

  addFriendlyObstruction(tag: Double, obstruction: FriendlyObstruction): void;

  removeAllFriendlyObstructions(tag: Double): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTAdsModule') : undefined;
