/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  version(): Promise<string>;

  setAutoplay(tag: number, autoplay: boolean): void;

  setPreload(tag: number, type: string): void;

  setCurrentTime(tag: number, seekTime: Double): void;

  setPipConfig(tag: number, config: Object): void;

  setBackgroundAudioConfig(tag: number, config: Object): void;

  setPresentationMode(tag: number, mode: string): void;

  setMuted(tag: number, muted: boolean): void;

  setPlaybackRate(tag: number, rate: Double): void;

  setSelectedAudioTrack(tag: number, trackUid: Double | undefined): void;

  setSelectedVideoTrack(tag: number, trackUid: Double | undefined): void;

  setSelectedTextTrack(tag: number, trackUid: Double | undefined): void;

  setSource(tag: number, source: Object): void;

  setTargetVideoQuality(tag: number, qualities: Double[]): void;

  setVolume(tag: number, volume: Double): void;

  setAspectRatio(tag: number, ratio: string): void;

  setRenderingTarget(tag: number, target: string): void;

  setKeepScreenOn(tag: number, keepScreenOn: boolean): void;

  setPaused(tag: number, paused: boolean): void;

  setTextTrackStyle(tag: number, style: Object): void;

  setABRConfig(tag: number, config: Object): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTPlayerModule') : undefined;
