import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  useFastStartup(useFastStartup: boolean): void;

  setLipSyncCorrection(correctionMs: Double): void;
}

export default TurboModuleRegistry?.getEnforcing<Spec>('THEORCTPlaybackSettingsModule');
