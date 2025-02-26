import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  setMyInt32(value: Int32): void;
}

export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTTestModule') : undefined;
