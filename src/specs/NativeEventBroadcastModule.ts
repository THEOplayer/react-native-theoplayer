/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  broadcastEvent(tag: Int32, event: Object): void;
}

export default TurboModuleRegistry?.getEnforcing<Spec>('THEORCTEventBroadcastModule');
