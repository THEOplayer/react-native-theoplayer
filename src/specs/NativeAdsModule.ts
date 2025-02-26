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
  view: number;
  purpose: string;
  reason?: string;
}>;

export interface Spec extends TurboModule {
  playing(tag: number): Promise<boolean>;

  skip(tag: number): void;

  currentAdBreak(tag: number): Promise<AdBreak>;

  currentAds(tag: number): Promise<Ad[]>;

  scheduledAdBreaks(tag: number): Promise<AdBreak[]>;

  schedule(tag: number, ad: ScheduledAd): void;

  /* GoogleDAI API */

  daiContentTimeForStreamTime(tag: number, time: Double): Promise<Double>;

  daiStreamTimeForContentTime(tag: number, time: Double): Promise<Double>;

  daiSnapback(tag: number): Promise<boolean>;

  daiSetSnapback(tag: number, enabled: boolean): void;

  /* Omid API */

  addFriendlyObstruction(tag: number, obstruction: FriendlyObstruction): void;

  removeAllFriendlyObstructions(tag: number): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTAdsModule') : undefined;
