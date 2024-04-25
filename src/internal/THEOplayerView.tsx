import React, { PureComponent } from 'react';
import {
  Dimensions,
  findNodeHandle,
  HostComponent,
  NativeSyntheticEvent,
  Platform,
  requireNativeComponent,
  StyleProp,
  StyleSheet,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';
import type { ScaledSize, EmitterSubscription } from 'react-native';
import { isDateRangeCue, PlayerConfiguration, PlayerError, PresentationMode, TextTrackCue, THEOplayerViewProps } from 'react-native-theoplayer';
import { CastEventType, PlayerEventType } from 'react-native-theoplayer';

import styles from './THEOplayerView.style';
import { decodeNanInf } from './utils/TypeUtils';
import { BaseEvent } from './adapter/event/BaseEvent';
import {
  DefaultAdEvent,
  DefaultAirplayStateChangeEvent,
  DefaultChromecastChangeEvent,
  DefaultChromecastErrorEvent,
  DefaultDurationChangeEvent,
  DefaultErrorEvent,
  DefaultLoadedMetadataEvent,
  DefaultMediaTrackEvent,
  DefaultMediaTrackListEvent,
  DefaultPresentationModeChangeEvent,
  DefaultProgressEvent,
  DefaultRateChangeEvent,
  DefaultReadyStateChangeEvent,
  DefaultSegmentNotFoundEvent,
  DefaultTextTrackEvent,
  DefaultTextTrackListEvent,
  DefaultVolumeChangeEvent,
  DefaultTimeupdateEvent,
  DefaultResizeEvent,
} from './adapter/event/PlayerEvents';
import type { NativeCastEvent } from './adapter/event/native/NativeCastEvent';
import type {
  NativeMediaTrackEvent,
  NativeMediaTrackListEvent,
  NativeTextTrackEvent,
  NativeTextTrackListEvent,
} from './adapter/event/native/NativeTrackEvent';
import { toMediaTrackType, toMediaTrackTypeEventType, toTextTrackEventType, toTrackListEventType } from './adapter/event/native/NativeTrackEvent';
import type {
  NativeDurationChangeEvent,
  NativeErrorEvent,
  NativeLoadedMetadataEvent,
  NativePlayerStateEvent,
  NativePresentationModeChangeEvent,
  NativeProgressEvent,
  NativeRateChangeEvent,
  NativeReadyStateChangeEvent,
  NativeSegmentNotFoundEvent,
  NativeTimeUpdateEvent,
  NativeVolumeChangeEvent,
  NativeResizeEvent,
} from './adapter/event/native/NativePlayerEvent';
import type { NativeAdEvent } from './adapter/event/native/NativeAdEvent';
import { THEOplayerAdapter } from './adapter/THEOplayerAdapter';
import { getFullscreenSize } from './utils/Dimensions';

const INVALID_HANDLE = -1;

interface THEOplayerRCTViewProps {
  ref: React.RefObject<THEOplayerViewNativeComponent>;
  style?: StyleProp<ViewStyle>;
  config?: PlayerConfiguration;
  onNativePlayerReady: (event: NativeSyntheticEvent<NativePlayerStateEvent>) => void;
  onNativeSourceChange: () => void;
  onNativeLoadStart: () => void;
  onNativeLoadedData: () => void;
  onNativeLoadedMetadata: (event: NativeSyntheticEvent<NativeLoadedMetadataEvent>) => void;
  onNativeReadyStateChange?: (event: NativeSyntheticEvent<NativeReadyStateChangeEvent>) => void;
  onNativeError: (event: NativeSyntheticEvent<NativeErrorEvent>) => void;
  onNativeProgress: (event: NativeSyntheticEvent<NativeProgressEvent>) => void;
  onNativeVolumeChange: (event: NativeSyntheticEvent<NativeVolumeChangeEvent>) => void;
  onNativeCanPlay: () => void;
  onNativePlay: () => void;
  onNativePlaying: () => void;
  onNativePause: () => void;
  onNativeSeeking: () => void;
  onNativeSeeked: () => void;
  onNativeEnded: () => void;
  onNativeWaiting: () => void;
  onNativeTimeUpdate: (event: NativeSyntheticEvent<NativeTimeUpdateEvent>) => void;
  onNativeDurationChange: (event: NativeSyntheticEvent<NativeDurationChangeEvent>) => void;
  onNativeRateChange: (event: NativeSyntheticEvent<NativeRateChangeEvent>) => void;
  onNativeSegmentNotFound: (event: NativeSyntheticEvent<NativeSegmentNotFoundEvent>) => void;
  onNativeTextTrackListEvent: (event: NativeSyntheticEvent<NativeTextTrackListEvent>) => void;
  onNativeTextTrackEvent: (event: NativeSyntheticEvent<NativeTextTrackEvent>) => void;
  onNativeMediaTrackListEvent: (event: NativeSyntheticEvent<NativeMediaTrackListEvent>) => void;
  onNativeMediaTrackEvent: (event: NativeSyntheticEvent<NativeMediaTrackEvent>) => void;
  onNativeAdEvent: (event: NativeSyntheticEvent<NativeAdEvent>) => void;
  onNativeCastEvent: (event: NativeSyntheticEvent<NativeCastEvent>) => void;
  onNativePresentationModeChange: (event: NativeSyntheticEvent<NativePresentationModeChangeEvent>) => void;
  onNativeResize: (event: NativeSyntheticEvent<NativeResizeEvent>) => void;
}

interface THEOplayerRCTViewState {
  error?: PlayerError;
  presentationMode?: PresentationMode | undefined;
  screenSize: ScaledSize;
}

type THEOplayerViewNativeComponent = HostComponent<THEOplayerRCTViewProps>;

export class THEOplayerView extends PureComponent<React.PropsWithChildren<THEOplayerViewProps>, THEOplayerRCTViewState> {
  private readonly _root: React.RefObject<THEOplayerViewNativeComponent>;
  private readonly _facade: THEOplayerAdapter;
  private _dimensionsHandler?: EmitterSubscription = undefined;

  private static initialState: THEOplayerRCTViewState = {
    error: undefined,
    presentationMode: PresentationMode.inline,
    screenSize: getFullscreenSize(),
  };

  constructor(props: THEOplayerViewProps) {
    super(props);
    this._root = React.createRef();
    this.state = THEOplayerView.initialState;
    this._facade = new THEOplayerAdapter(this);
  }

  componentDidMount() {
    this._dimensionsHandler = Dimensions.addEventListener('change', this._onDimensionsChanged);
  }

  componentWillUnmount() {
    // Notify the player will be destroyed.
    const { onPlayerDestroy } = this.props;
    if (onPlayerDestroy) {
      onPlayerDestroy(this._facade);
    }
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.DESTROY));
    this._dimensionsHandler?.remove();

    if (Platform.OS === 'ios') {
      // TODO: move to native module
      // on iOS, we trigger an explicit 'destroy' to clean up the underlying THEOplayer
      const command = (UIManager as { [index: string]: any })['THEOplayerRCTView'].Commands.destroy;
      UIManager.dispatchViewManagerCommand(findNodeHandle(this._root.current), command, []);
    }
    this._facade.clearEventListeners();
  }

  public get nativeHandle(): number {
    return findNodeHandle(this._root.current) || INVALID_HANDLE;
  }

  private reset() {
    this.setState( prevState => ({
      ...prevState,
      error: undefined
    }));
  }

  private _onDimensionsChanged = () => {
    this.setState({ screenSize: getFullscreenSize() });
  };

  private _onNativePlayerReady = (event: NativeSyntheticEvent<NativePlayerStateEvent>) => {
    // Optionally apply an initial player state
    const { version, state } = event.nativeEvent;
    this._facade.initializeFromNativePlayer_(version, state);
    this.props.onPlayerReady?.(this._facade);
  };

  private _onSourceChange = () => {
    this.reset();
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.SOURCE_CHANGE));
  };

  private _onLoadStart = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.LOAD_START));
  };

  private _onLoadedData = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.LOADED_DATA));
  };

  private _onLoadedMetadata = (event: NativeSyntheticEvent<NativeLoadedMetadataEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._facade.dispatchEvent(
      new DefaultLoadedMetadataEvent(
        nativeEvent.textTracks,
        nativeEvent.audioTracks,
        nativeEvent.videoTracks,
        decodeNanInf(nativeEvent.duration),
        nativeEvent.selectedTextTrack,
        nativeEvent.selectedVideoTrack,
        nativeEvent.selectedAudioTrack,
      ),
    );
  };

  private _onVolumeChange = (event: NativeSyntheticEvent<NativeVolumeChangeEvent>) => {
    this._facade.dispatchEvent(new DefaultVolumeChangeEvent(event.nativeEvent.volume, event.nativeEvent.muted));
  };

  private _onError = (event: NativeSyntheticEvent<NativeErrorEvent>) => {
    const { error } = event.nativeEvent;
    this.setState({ error });
    this._facade.dispatchEvent(new DefaultErrorEvent(event.nativeEvent.error));
  };

  private _onProgress = (event: NativeSyntheticEvent<NativeProgressEvent>) => {
    this._facade.dispatchEvent(new DefaultProgressEvent(event.nativeEvent.seekable, event.nativeEvent.buffered));
  };

  private _onCanPlay = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.CANPLAY));
  };

  private _onPlay = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.PLAY));
  };

  private _onPlaying = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.PLAYING));
  };

  private _onPause = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.PAUSE));
  };

  private _onSeeking = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.SEEKING));
  };

  private _onSeeked = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.SEEKED));
  };

  private _onWaiting = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.WAITING));
  };

  private _onEnded = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.ENDED));
  };

  private _onReadStateChange = (event: NativeSyntheticEvent<NativeReadyStateChangeEvent>) => {
    this._facade.dispatchEvent(new DefaultReadyStateChangeEvent(event.nativeEvent.readyState));
  };

  private _onTimeUpdate = (event: NativeSyntheticEvent<NativeTimeUpdateEvent>) => {
    this._facade.dispatchEvent(new DefaultTimeupdateEvent(event.nativeEvent.currentTime, event.nativeEvent.currentProgramDateTime));
  };

  private _onDurationChange = (event: NativeSyntheticEvent<NativeDurationChangeEvent>) => {
    this._facade.dispatchEvent(new DefaultDurationChangeEvent(decodeNanInf(event.nativeEvent.duration)));
  };

  private _onRateChange = (event: NativeSyntheticEvent<NativeRateChangeEvent>) => {
    this._facade.dispatchEvent(new DefaultRateChangeEvent(event.nativeEvent.playbackRate));
  };

  private _onSegmentNotFound = (event: NativeSyntheticEvent<NativeSegmentNotFoundEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._facade.dispatchEvent(new DefaultSegmentNotFoundEvent(nativeEvent.segmentStartTime, nativeEvent.error, nativeEvent.retryCount));
  };

  private _onTextTrackListEvent = (event: NativeSyntheticEvent<NativeTextTrackListEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._facade.dispatchEvent(new DefaultTextTrackListEvent(toTrackListEventType(nativeEvent.type), nativeEvent.track));
  };

  private _onTextTrackEvent = (event: NativeSyntheticEvent<NativeTextTrackEvent>) => {
    const nativeEvent = event.nativeEvent;
    const cue = nativeEvent.cue;
    if (cue) {
      this.normalizeCue(cue);
    }
    this._facade.dispatchEvent(new DefaultTextTrackEvent(toTextTrackEventType(nativeEvent.type), nativeEvent.trackUid, cue));
  };

  private normalizeCue(cue: TextTrackCue) {
    cue.startTime = decodeNanInf(cue.startTime);
    cue.endTime = decodeNanInf(cue.endTime);
    if (isDateRangeCue(cue)) {
      cue.startDate = new Date(cue.startDate);
      if (cue.endDate) {
        cue.endDate = new Date(cue.endDate);
      }
      if (cue.duration) {
        cue.duration = decodeNanInf(cue.duration);
      }
      if (cue.plannedDuration) {
        cue.plannedDuration = decodeNanInf(cue.plannedDuration);
      }
    }
  }

  private _onMediaTrackListEvent = (event: NativeSyntheticEvent<NativeMediaTrackListEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._facade.dispatchEvent(
      new DefaultMediaTrackListEvent(toTrackListEventType(nativeEvent.type), toMediaTrackType(nativeEvent.trackType), nativeEvent.track),
    );
  };

  private _onMediaTrackEvent = (event: NativeSyntheticEvent<NativeMediaTrackEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._facade.dispatchEvent(
      new DefaultMediaTrackEvent(
        toMediaTrackTypeEventType(nativeEvent.type),
        toMediaTrackType(nativeEvent.trackType),
        nativeEvent.trackUid,
        nativeEvent.qualities,
      ),
    );
  };

  private _onAdEvent = (event: NativeSyntheticEvent<NativeAdEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._facade.dispatchEvent(new DefaultAdEvent(nativeEvent.type, nativeEvent.ad));
  };

  private _onCastEvent = (event: NativeSyntheticEvent<NativeCastEvent>) => {
    switch (event.nativeEvent.type) {
      case CastEventType.CHROMECAST_STATE_CHANGE:
        this._facade.dispatchEvent(new DefaultChromecastChangeEvent(event.nativeEvent.state));
        break;
      case CastEventType.AIRPLAY_STATE_CHANGE:
        this._facade.dispatchEvent(new DefaultAirplayStateChangeEvent(event.nativeEvent.state));
        break;
      case CastEventType.CHROMECAST_ERROR:
        this._facade.dispatchEvent(new DefaultChromecastErrorEvent(event.nativeEvent.error));
        break;
    }
  };

  private _onPresentationModeChange = (event: NativeSyntheticEvent<NativePresentationModeChangeEvent>) => {
    this.setState({ presentationMode: event.nativeEvent.presentationMode });
    this._facade.dispatchEvent(
      new DefaultPresentationModeChangeEvent(
        event.nativeEvent.presentationMode,
        event.nativeEvent.previousPresentationMode,
        event.nativeEvent.context,
      ),
    );
  };

  private _onResize = (event: NativeSyntheticEvent<NativeResizeEvent>) => {
    this._facade.dispatchEvent(new DefaultResizeEvent(event.nativeEvent.width, event.nativeEvent.height));
  };

  public render(): JSX.Element {
    const { config, style, children } = this.props;
    const { presentationMode, screenSize: fullscreenSize } = this.state;

    return (
      <View style={[styles.base, style, presentationMode === PresentationMode.fullscreen ? fullscreenSize : {}]}>
        <THEOplayerRCTView
          ref={this._root}
          style={StyleSheet.absoluteFill}
          config={config || {}}
          onNativePlayerReady={this._onNativePlayerReady}
          onNativeSourceChange={this._onSourceChange}
          onNativeLoadStart={this._onLoadStart}
          onNativeLoadedData={this._onLoadedData}
          onNativeLoadedMetadata={this._onLoadedMetadata}
          onNativeVolumeChange={this._onVolumeChange}
          onNativeError={this._onError}
          onNativeProgress={this._onProgress}
          onNativeCanPlay={this._onCanPlay}
          onNativePlay={this._onPlay}
          onNativePlaying={this._onPlaying}
          onNativePause={this._onPause}
          onNativeSeeking={this._onSeeking}
          onNativeSeeked={this._onSeeked}
          onNativeWaiting={this._onWaiting}
          onNativeEnded={this._onEnded}
          onNativeReadyStateChange={this._onReadStateChange}
          onNativeTimeUpdate={this._onTimeUpdate}
          onNativeDurationChange={this._onDurationChange}
          onNativeRateChange={this._onRateChange}
          onNativeSegmentNotFound={this._onSegmentNotFound}
          onNativeTextTrackListEvent={this._onTextTrackListEvent}
          onNativeTextTrackEvent={this._onTextTrackEvent}
          onNativeMediaTrackListEvent={this._onMediaTrackListEvent}
          onNativeMediaTrackEvent={this._onMediaTrackEvent}
          onNativeAdEvent={this._onAdEvent}
          onNativeCastEvent={this._onCastEvent}
          onNativePresentationModeChange={this._onPresentationModeChange}
          onNativeResize={this._onResize}
        />
        {children}
      </View>
    );
  }
}

const LINKING_ERROR =
  `The package 'react-native-theoplayer' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const ComponentName = 'THEOplayerRCTView';

const THEOplayerRCTView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<THEOplayerRCTViewProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
