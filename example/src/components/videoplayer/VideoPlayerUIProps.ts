import type { Source } from '../../utils/source/Source';
import type { MediaTrack, PlayerError, TextTrack, THEOplayerInternal, TimeRange } from 'react-native-theoplayer';
import type { StyleProp, ViewStyle } from 'react-native';
import { Dimensions, Platform } from 'react-native';

// default thumbnail size (width).
export const THUMBNAIL_SIZE = 0.19 * Math.max(Dimensions.get('window').width, Dimensions.get('window').height);

// carousel mode
export const THUMBNAIL_MODE: 'single' | 'carousel' = 'carousel';

// whether to show a video quality selection menu. Hidden by default.
export const ENABLE_QUALITY_MENU = false;

// whether to show a cast button.
// NOTE: react-native-google-cast does not support web yet.
export const ENABLE_CAST_BUTTON = Platform.OS !== 'web';

export interface VideoPlayerUIProps {
  sources: Source[];
  style?: StyleProp<ViewStyle>;
  player: THEOplayerInternal;
}

export interface VideoPlayerUIState {
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
  targetVideoQuality: number | number[] | undefined;
  selectedAudioTrack: number | undefined;
  error: PlayerError | undefined;
  message: string | undefined;
  airplayIsConnected: boolean;
  chromecastIsConnected: boolean;
}
