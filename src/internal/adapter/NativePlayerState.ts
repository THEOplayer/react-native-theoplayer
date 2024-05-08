import { MediaTrack, PreloadType, PresentationMode, SourceDescription, TextTrack, TimeRange } from 'react-native-theoplayer';
import type { PiPConfiguration, AspectRatio, BackgroundAudioConfiguration } from 'react-native-theoplayer';

export interface PlayerConfigState {
  source: SourceDescription | undefined;
  autoplay: boolean;
  pipConfig: PiPConfiguration;
  backgroundAudioConfig: BackgroundAudioConfiguration;
  preload: PreloadType;
  keepScreenOn: boolean;
  width: number | undefined;
  height: number | undefined;
}

export interface PlaybackState {
  paused: boolean;
  muted: boolean;
  seeking: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  seekable: TimeRange[];
  buffered: TimeRange[];
  presentationMode: PresentationMode;
  aspectRatio: AspectRatio;
}

export interface MediaTrackState {
  audioTracks: MediaTrack[];
  videoTracks: MediaTrack[];
  targetVideoQuality: number | number[] | undefined;
  selectedVideoTrack: number | undefined;
  selectedAudioTrack: number | undefined;
}

export interface TextTrackState {
  textTracks: TextTrack[];
  selectedTextTrack: number | undefined;
}

export interface NativePlayerState extends PlayerConfigState, PlaybackState, TextTrackState, MediaTrackState {
}
