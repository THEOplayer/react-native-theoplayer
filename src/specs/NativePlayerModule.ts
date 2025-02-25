/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface Spec extends TurboModule {
  version(): Promise<string>;

  setAutoplay(tag: Double, autoplay: boolean): void;

  setPreload(tag: Double, type: string): void;

  setCurrentTime(tag: Double, seekTime: Double): void;

  setPipConfig(tag: Double, config: Object): void;

  setBackgroundAudioConfig(tag: Double, config: Object): void;

  setPresentationMode(tag: Double, mode: string): void;

  setMuted(tag: Double, muted: boolean): void;

  setPlaybackRate(tag: Double, rate: Double): void;

  setSelectedAudioTrack(tag: Double, trackUid: Double | undefined): void;

  setSelectedVideoTrack(tag: Double, trackUid: Double | undefined): void;

  setSelectedTextTrack(tag: Double, trackUid: Double | undefined): void;

  setSource(tag: Double, source: Object): void;

  setTargetVideoQuality(tag: Double, qualities: Double[]): void;

  setVolume(tag: Double, volume: Double): void;

  setAspectRatio(tag: Double, ratio: string): void;

  setRenderingTarget(tag: Double, target: string): void;

  setKeepScreenOn(tag: Double, keepScreenOn: boolean): void;

  setPaused(tag: Double, paused: boolean): void;

  setTextTrackStyle(tag: Double, style: Object): void;

  setABRConfig(tag: Double, config: Object): void;
}

// Note: codegen does not like `TurboModuleRegistry?.getEnforcing`
export default TurboModuleRegistry ? TurboModuleRegistry.getEnforcing<Spec>('THEORCTPlayerModule') : undefined;
