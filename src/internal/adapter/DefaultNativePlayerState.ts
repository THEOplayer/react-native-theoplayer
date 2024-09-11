import { DefaultTextTrackState } from './DefaultTextTrackState';
import type { NativePlayerState } from './NativePlayerState';
import {
  AspectRatio,
  BackgroundAudioConfiguration,
  type MediaTrack,
  PiPConfiguration,
  PreloadType,
  PresentationMode,
  RenderingTarget,
  SourceDescription,
  TimeRange,
} from 'react-native-theoplayer';

export class DefaultNativePlayerState extends DefaultTextTrackState implements NativePlayerState {
  source: SourceDescription | undefined = undefined;
  autoplay = false;
  paused = true;
  seekable: TimeRange[] = [];
  buffered: TimeRange[] = [];
  pipConfig: PiPConfiguration = { startsAutomatically: false };
  backgroundAudioConfig: BackgroundAudioConfiguration = { enabled: false };
  presentationMode: PresentationMode = PresentationMode.inline;
  muted = false;
  seeking = false;
  volume = 1;
  currentTime = 0;
  duration = NaN;
  playbackRate = 1;
  preload: PreloadType = 'none';
  aspectRatio: AspectRatio = AspectRatio.FIT;
  renderingTarget: RenderingTarget = RenderingTarget.SURFACE_VIEW;
  keepScreenOn = true;
  audioTracks: MediaTrack[] = [];
  videoTracks: MediaTrack[] = [];
  targetVideoQuality: number | number[] | undefined = undefined;
  selectedAudioTrack: number | undefined = undefined;
  selectedVideoTrack: number | undefined = undefined;
  width: number | undefined = undefined;
  height: number | undefined = undefined;

  apply(state: Partial<NativePlayerState>): void {
    Object.assign(this, state);
  }
}
