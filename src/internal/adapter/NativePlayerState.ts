import type { MediaTrack, PreloadType, PresentationMode, SourceDescription, TextTrack, TimeRange } from 'react-native-theoplayer';
import type { PiPConfiguration, AspectRatio, BackgroundAudioConfiguration } from 'react-native-theoplayer';

export interface NativePlayerState {
  source: SourceDescription | undefined;
  autoplay: boolean;
  paused: boolean;
  seekable: TimeRange[];
  buffered: TimeRange[];
  pipConfig: PiPConfiguration;
  backgroundAudioConfig: BackgroundAudioConfiguration;
  presentationMode: PresentationMode;
  muted: boolean;
  seeking: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playbackRate: number;
  preload: PreloadType;
  aspectRatio: AspectRatio;
  keepScreenOn: boolean;
  audioTracks: MediaTrack[];
  videoTracks: MediaTrack[];
  textTracks: TextTrack[];
  targetVideoQuality: number | number[] | undefined;
  selectedVideoTrack: number | undefined;
  selectedAudioTrack: number | undefined;
  selectedTextTrack: number | undefined;
}
