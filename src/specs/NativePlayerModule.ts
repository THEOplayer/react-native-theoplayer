/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Int32, Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  version(): Promise<string>;

  setPreload(tag: Int32, type: string): void;

  setCurrentTime(tag: Int32, seekTime: Double): void;

  setPipConfig(tag: Int32, config: Object): void;

  setBackgroundAudioConfig(tag: Int32, config: Object): void;

  setPresentationMode(tag: Int32, mode: string): void;

  setMuted(tag: Int32, muted: boolean): void;

  setPlaybackRate(tag: Int32, rate: Double): void;

  setSelectedAudioTrack(tag: Int32, trackUid: Int32 | undefined): void;

  setSelectedVideoTrack(tag: Int32, trackUid: Int32 | undefined): void;

  setSelectedTextTrack(tag: Int32, trackUid: Int32 | undefined): void;

  setSource(tag: Int32, source: Object): void;

  setTargetVideoQuality(tag: Int32, qualities: Int32[]): void;

  setVolume(tag: Int32, volume: Double): void;

  setAspectRatio(tag: Int32, ratio: string): void;

  setRenderingTarget(tag: Int32, target: string): void;

  setKeepScreenOn(tag: Int32, keepScreenOn: boolean): void;

  setPaused(tag: Double, paused: boolean): void;

  setTextTrackStyle(tag: Int32, style: Object): void;

  setABRConfig(tag: Int32, config: Object): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTPlayerModule') : undefined;
