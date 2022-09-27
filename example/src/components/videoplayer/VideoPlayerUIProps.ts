import type { Source } from '../../utils/source/Source';
import type { MediaTrack, PlayerError, TextTrack, TimeRange } from 'react-native-theoplayer';
import type { StyleProp, ViewStyle } from 'react-native';
import { Dimensions } from 'react-native';

// default thumbnail size (width).
export const THUMBNAIL_SIZE = 0.19 * Math.max(Dimensions.get('window').width, Dimensions.get('window').height);

// carousel mode
export const THUMBNAIL_MODE: 'single' | 'carousel' = 'carousel';

export interface VideoPlayerUIProps {
  sources: Source[];
  srcIndex: number;
  playbackRate: number;
  volume: number;
  muted: boolean;
  duration: number;
  seekable: TimeRange[];
  currentTime: number;
  paused: boolean;
  fullscreen: boolean;
  showLoadingIndicator: boolean;
  textTracks: TextTrack[];
  videoTracks: MediaTrack[];
  audioTracks: MediaTrack[];
  selectedTextTrack: number | undefined;
  selectedVideoTrack: number | undefined;
  targetVideoTrackQuality: number | number[] | undefined;
  selectedAudioTrack: number | undefined;
  error: PlayerError | undefined;

  onSetPlayPause?: (pause: boolean) => void;
  onSeek?: (time: number) => void;
  onSelectSource?: (index: number) => void;
  onSelectTextTrack?: (uid: number | undefined) => void;
  onSelectAudioTrack?: (uid: number | undefined) => void;
  onSelectVideoTrack?: (uid: number | undefined) => void;
  onSelectTargetVideoQuality?: (uid: number | number[] | undefined) => void;
  onSetFullScreen?: (fullscreen: boolean) => void;
  onSetMuted?: (muted: boolean) => void;
  onSetPlaybackRate?: (playbackRate: number) => void;
  onSetVolume?: (volume: number) => void;

  style?: StyleProp<ViewStyle>;
}
