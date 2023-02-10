import React, { PureComponent } from 'react';
import {
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
import type { PlayerConfiguration, PlayerError, THEOplayerViewProps } from 'react-native-theoplayer';
import { CastEventType, FullscreenActionType, PlayerEventType } from 'react-native-theoplayer';

import styles from './THEOplayerView.style';
import { decodeNanInf } from './utils/TypeUtils';
import { BaseEvent } from './adapter/event/BaseEvent';
import {
  DefaultAdEvent,
  DefaultAirplayStateChangeEvent,
  DefaultChromecastChangeEvent,
  DefaultChromecastErrorEvent,
  DefaultDurationChangeEvent,
  DefaultRateChangeEvent,
  DefaultErrorEvent,
  DefaultFullscreenEvent,
  DefaultLoadedMetadataEvent,
  DefaultMediaTrackEvent,
  DefaultMediaTrackListEvent,
  DefaultProgressEvent,
  DefaultReadyStateChangeEvent,
  DefaultSegmentNotFoundEvent,
  DefaultTextTrackEvent,
  DefaultTextTrackListEvent,
  DefaultTimeupdateEvent,
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
  NativeRateChangeEvent,
  NativeErrorEvent,
  NativeLoadedMetadataEvent,
  NativeProgressEvent,
  NativeReadyStateChangeEvent,
  NativeSegmentNotFoundEvent,
  NativeTimeUpdateEvent,
} from './adapter/event/native/NativePlayerEvent';
import type { NativeAdEvent } from './adapter/event/native/NativeAdEvent';
import { THEOplayerAdapter } from './adapter/THEOplayerAdapter';

interface THEOplayerRCTViewProps {
  ref: React.RefObject<THEOplayerViewNativeComponent>;
  style?: StyleProp<ViewStyle>;
  config?: PlayerConfiguration;
  onNativePlayerReady: () => void;
  onNativeSourceChange: () => void;
  onNativeLoadStart: () => void;
  onNativeLoadedData: () => void;
  onNativeLoadedMetadata: (event: NativeSyntheticEvent<NativeLoadedMetadataEvent>) => void;
  onNativeReadyStateChange?: (event: NativeSyntheticEvent<NativeReadyStateChangeEvent>) => void;
  onNativeError: (event: NativeSyntheticEvent<NativeErrorEvent>) => void;
  onNativeProgress: (event: NativeSyntheticEvent<NativeProgressEvent>) => void;
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
  onNativeFullscreenPlayerWillPresent?: () => void;
  onNativeFullscreenPlayerDidPresent?: () => void;
  onNativeFullscreenPlayerWillDismiss?: () => void;
  onNativeFullscreenPlayerDidDismiss?: () => void;
}

interface THEOplayerRCTViewState {
  error?: PlayerError;
}

type THEOplayerViewNativeComponent = HostComponent<THEOplayerRCTViewProps>;

export class THEOplayerView extends PureComponent<THEOplayerViewProps, THEOplayerRCTViewState> {
  private readonly _root: React.RefObject<THEOplayerViewNativeComponent>;
  private readonly _facade: THEOplayerAdapter;

  private static initialState: THEOplayerRCTViewState = {
    error: undefined,
  };

  constructor(props: THEOplayerViewProps) {
    super(props);
    this._root = React.createRef();
    this.state = THEOplayerView.initialState;
    this._facade = new THEOplayerAdapter(this);
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      // TODO: move to native module
      // on iOS, we trigger an explicit 'destroy' to clean up the underlying THEOplayer
      const command = (UIManager as { [index: string]: any })['THEOplayerRCTView'].Commands.destroy;
      UIManager.dispatchViewManagerCommand(findNodeHandle(this._root.current), command, []);
    }
    this._facade.clearEventListeners();
  }

  public get nativeHandle(): number | null {
    return findNodeHandle(this._root.current);
  }

  private reset() {
    this.setState(THEOplayerView.initialState);
  }

  private _onNativePlayerReady = () => {
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
        nativeEvent.duration,
        nativeEvent.selectedTextTrack,
        nativeEvent.selectedVideoTrack,
        nativeEvent.selectedAudioTrack,
      ),
    );
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
    this._facade.dispatchEvent(new DefaultTextTrackEvent(toTextTrackEventType(nativeEvent.type), nativeEvent.trackUid, nativeEvent.cue));
  };

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

  private _onFullscreenPlayerWillPresent = () => {
    this._facade.dispatchEvent(new DefaultFullscreenEvent(FullscreenActionType.PLAYER_WILL_PRESENT));
  };

  private _onFullscreenPlayerDidPresent = () => {
    this._facade.dispatchEvent(new DefaultFullscreenEvent(FullscreenActionType.PLAYER_DID_PRESENT));
  };

  private _onFullscreenPlayerWillDismiss = () => {
    this._facade.dispatchEvent(new DefaultFullscreenEvent(FullscreenActionType.PLAYER_WILL_DISMISS));
  };

  private _onFullscreenPlayerDidDismiss = () => {
    this._facade.dispatchEvent(new DefaultFullscreenEvent(FullscreenActionType.PLAYER_DID_DISMISS));
  };

  public render(): JSX.Element {
    const { config, style } = this.props;
    return (
      <View style={[styles.base, style]}>
        <THEOplayerRCTView
          ref={this._root}
          style={StyleSheet.absoluteFill}
          config={config || {}}
          onNativePlayerReady={this._onNativePlayerReady}
          onNativeSourceChange={this._onSourceChange}
          onNativeLoadStart={this._onLoadStart}
          onNativeLoadedData={this._onLoadedData}
          onNativeLoadedMetadata={this._onLoadedMetadata}
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
          onNativeFullscreenPlayerWillPresent={this._onFullscreenPlayerWillPresent}
          onNativeFullscreenPlayerDidPresent={this._onFullscreenPlayerDidPresent}
          onNativeFullscreenPlayerWillDismiss={this._onFullscreenPlayerWillDismiss}
          onNativeFullscreenPlayerDidDismiss={this._onFullscreenPlayerDidDismiss}
        />
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
