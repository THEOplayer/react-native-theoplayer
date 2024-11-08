/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  createTask(source: Object, parameters: Object): void;

  getInitialState(): Promise<Object>;

  renewLicense(taskId: string, drmConfig: Object): void;

  pauseCachingTask(taskId: string): void;

  removeCachingTask(taskId: string): void;

  startCachingTask(taskId: string): void;
}

export default TurboModuleRegistry?.getEnforcing<Spec>('THEORCTCacheModule');
