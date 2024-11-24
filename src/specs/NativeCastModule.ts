/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Int32 } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  casting(tag: Int32): Promise<boolean>;

  chromecastCasting(tag: Int32): Promise<boolean>;

  airplayCasting(tag: Int32): Promise<boolean>;

  chromecastState(tag: Int32): Promise<Object>;

  airplayState(tag: Int32): Promise<Object>;

  chromecastStart(tag: Int32): void;

  chromecastStop(tag: Int32): void;

  chromecastJoin(tag: Int32): void;

  chromecastLeave(tag: Int32): void;

  airplayStart(tag: Int32): void;

  airplayStop(tag: Int32): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTCastModule') : undefined;
