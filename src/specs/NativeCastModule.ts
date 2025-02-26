/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  casting(tag: number): Promise<boolean>;

  chromecastCasting(tag: number): Promise<boolean>;

  airplayCasting(tag: number): Promise<boolean>;

  chromecastState(tag: number): Promise<Object>;

  airplayState(tag: number): Promise<Object>;

  chromecastStart(tag: number): void;

  chromecastStop(tag: number): void;

  chromecastJoin(tag: number): void;

  chromecastLeave(tag: number): void;

  airplayStart(tag: number): void;

  airplayStop(tag: number): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTCastModule') : undefined;
