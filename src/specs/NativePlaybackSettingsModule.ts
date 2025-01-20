import { Platform, TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  useFastStartup(useFastStartup: boolean): void;

  setLipSyncCorrection(correctionMs: Double): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry && Platform.OS == 'android' ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTPlaybackSettingsModule') : undefined;
