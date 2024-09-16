import { HostComponent, ViewProps } from 'react-native';
import { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import { PlayerConfiguration } from 'react-native-theoplayer';
import type {
  NativeDurationChangeEvent,
  NativeErrorEvent,
  NativeLoadedMetadataEvent,
  NativePlayerStateEvent,
  NativePresentationModeChangeEvent,
  NativeProgressEvent,
  NativeRateChangeEvent,
  NativeReadyStateChangeEvent,
  NativeResizeEvent,
  NativeSegmentNotFoundEvent,
  NativeTimeUpdateEvent,
  NativeVolumeChangeEvent,
} from '../internal/adapter/event/native/NativePlayerEvent';
import type {
  NativeMediaTrackEvent,
  NativeMediaTrackListEvent,
  NativeTextTrackEvent,
  NativeTextTrackListEvent,
} from '../internal/adapter/event/native/NativeTrackEvent';
import type { NativeAdEvent } from '../internal/adapter/event/native/NativeAdEvent';
import type { NativeCastEvent } from '../internal/adapter/event/native/NativeCastEvent';

export interface NativeProps extends ViewProps {
  config?: PlayerConfiguration;

  onNativePlayerReady: DirectEventHandler<Readonly<NativePlayerStateEvent>>;
  onNativeSourceChange: DirectEventHandler<void>;
  onNativeLoadStart: DirectEventHandler<void>;
  onNativeLoadedData: DirectEventHandler<void>;
  onNativeLoadedMetadata: DirectEventHandler<Readonly<NativeLoadedMetadataEvent>>;
  onNativeVolumeChange: DirectEventHandler<Readonly<NativeVolumeChangeEvent>>;
  onNativeError: DirectEventHandler<Readonly<NativeErrorEvent>>;
  onNativeProgress: DirectEventHandler<Readonly<NativeProgressEvent>>;
  onNativeCanPlay: DirectEventHandler<void>;
  onNativePlay: DirectEventHandler<void>;
  onNativePlaying: DirectEventHandler<void>;
  onNativePause: DirectEventHandler<void>;
  onNativeSeeking: DirectEventHandler<void>;
  onNativeSeeked: DirectEventHandler<void>;
  onNativeWaiting: DirectEventHandler<void>;
  onNativeEnded: DirectEventHandler<void>;
  onNativeReadStateChange: DirectEventHandler<Readonly<NativeReadyStateChangeEvent>>;
  onNativeTimeUpdate: DirectEventHandler<Readonly<NativeTimeUpdateEvent>>;
  onNativeDurationChange: DirectEventHandler<Readonly<NativeDurationChangeEvent>>;
  onNativeRateChange: DirectEventHandler<Readonly<NativeRateChangeEvent>>;
  onNativeSegmentNotFound: DirectEventHandler<Readonly<NativeSegmentNotFoundEvent>>;
  onNativeTextTrackListEvent: DirectEventHandler<Readonly<NativeTextTrackListEvent>>;
  onNativeTextTrackEvent: DirectEventHandler<Readonly<NativeTextTrackEvent>>;
  onNativeMediaTrackListEvent: DirectEventHandler<Readonly<NativeMediaTrackListEvent>>;
  onNativeMediaTrackEvent: DirectEventHandler<Readonly<NativeMediaTrackEvent>>;
  onNativeAdEvent: DirectEventHandler<Readonly<NativeAdEvent>>;
  onNativeCastEvent: DirectEventHandler<Readonly<NativeCastEvent>>;
  onNativePresentationModeChange: DirectEventHandler<Readonly<NativePresentationModeChangeEvent>>;
  onNativeResize: DirectEventHandler<Readonly<NativeResizeEvent>>;
}

export default codegenNativeComponent<NativeProps>('THEOplayerRCTView') as HostComponent<NativeProps>;
