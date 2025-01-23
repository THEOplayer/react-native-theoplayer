/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  casting(tag: Double): Promise<boolean>;

  chromecastCasting(tag: Double): Promise<boolean>;

  airplayCasting(tag: Double): Promise<boolean>;

  chromecastState(tag: Double): Promise<Object>;

  airplayState(tag: Double): Promise<Object>;

  chromecastStart(tag: Double): void;

  chromecastStop(tag: Double): void;

  chromecastJoin(tag: Double): void;

  chromecastLeave(tag: Double): void;

  airplayStart(tag: Double): void;

  airplayStop(tag: Double): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTCastModule') : undefined;
