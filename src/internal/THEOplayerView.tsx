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
import type {
  ABRConfiguration,
  AdEvent,
  AdsAPI,
  CastAPI,
  CastEvent,
  DurationChangeEvent,
  ErrorEvent,
  LoadedMetadataEvent,
  MediaTrackEvent,
  MediaTrackListEvent,
  PlayerConfiguration,
  PlayerError,
  ProgressEvent,
  ReadyStateChangeEvent,
  SegmentNotFoundEvent,
  SourceDescription,
  TextTrackEvent,
  TextTrackListEvent,
  THEOplayerViewProps,
  TimeUpdateEvent,
} from 'react-native-theoplayer';
import { CastEventType, FullscreenActionType, PlayerEventType } from 'react-native-theoplayer';

import styles from './THEOplayerView.style';
import { decodeNanInf } from './utils/TypeUtils';
import { BaseEvent } from './event/BaseEvent';
import {
  DefaultAdEvent,
  DefaultAirplayStateChangeEvent,
  DefaultBufferingChangeEvent,
  DefaultChromecastChangeEvent,
  DefaultChromecastErrorEvent,
  DefaultDurationChangeEvent,
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
} from './event/PlayerEvents';
import type { NativeCastEvent } from './event/native/NativeCastEvent';
import type {
  NativeMediaTrackEvent,
  NativeMediaTrackListEvent,
  NativeTextTrackEvent,
  NativeTextTrackListEvent,
} from './event/native/NativeTrackEvent';
import { toMediaTrackType, toMediaTrackTypeEventType, toTextTrackEventType, toTrackListEventType } from './event/native/NativeTrackEvent';
import type {
  NativeDurationChangeEvent,
  NativeErrorEvent,
  NativeLoadedMetadataEvent,
  NativeProgressEvent,
  NativeReadyStateChangeEvent,
  NativeSegmentNotFoundEvent,
  NativeTimeUpdateEvent,
} from './event/native/NativePlayerEvent';
import type { NativeAdEvent } from './event/native/NativeAdEvent';
import { THEOplayerViewExposed } from './exposed/THEOplayerViewExposed';

export interface LegacyTHEOplayerViewProps {
  config?: PlayerConfiguration;
  abrConfig?: ABRConfiguration;
  source?: SourceDescription;
  paused?: boolean;
  playbackRate?: number;
  volume?: number;
  muted?: boolean;
  fullscreen?: boolean;
  selectedTextTrack?: number | undefined;
  selectedVideoTrack?: number | undefined;
  targetVideoQuality?: number | number[] | undefined;
  selectedAudioTrack?: number | undefined;
  style?: StyleProp<ViewStyle>;
  onFullscreenPlayerWillPresent?: () => void;
  onFullscreenPlayerDidPresent?: () => void;
  onFullscreenPlayerWillDismiss?: () => void;
  onFullscreenPlayerDidDismiss?: () => void;
  onBufferingStateChange?: (isBuffering: boolean) => void;
  onSourceChange?: () => void;
  onLoadStart?: () => void;
  onLoadedMetadata?: (event: LoadedMetadataEvent) => void;
  onLoadedData?: () => void;
  onReadyStateChange?: (event: ReadyStateChangeEvent) => void;
  onError?: (event: ErrorEvent) => void;
  onProgress?: (event: ProgressEvent) => void;
  onPlay?: () => void;
  onPlaying?: () => void;
  onPause?: () => void;
  onSeeking?: () => void;
  onSeeked?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (event: TimeUpdateEvent) => void;
  onDurationChange?: (event: DurationChangeEvent) => void;
  onSegmentNotFound?: (event: SegmentNotFoundEvent) => void;
  onTextTrackListEvent?: (event: TextTrackListEvent) => void;
  onTextTrackEvent?: (event: TextTrackEvent) => void;
  onMediaTrackListEvent?: (event: MediaTrackListEvent) => void;
  onMediaTrackEvent?: (event: MediaTrackEvent) => void;
  onAdEvent?: (event: AdEvent) => void;
  onCastEvent?: (event: CastEvent) => void;
}

interface THEOplayerRCTViewProps extends LegacyTHEOplayerViewProps {
  ref: React.RefObject<THEOplayerViewNativeComponent>;
  src: SourceDescription;
  seek?: number;

  onNativeSourceChange: () => void;
  onNativeLoadStart: () => void;
  onNativeLoadedData: () => void;
  onNativeLoadedMetadata: (event: NativeSyntheticEvent<NativeLoadedMetadataEvent>) => void;
  onNativeReadyStateChange?: (event: NativeSyntheticEvent<NativeReadyStateChangeEvent>) => void;
  onNativeError: (event: NativeSyntheticEvent<NativeErrorEvent>) => void;
  onNativeProgress: (event: NativeSyntheticEvent<NativeProgressEvent>) => void;
  onNativePlay: () => void;
  onNativePlaying: () => void;
  onNativePause: () => void;
  onNativeSeeking: () => void;
  onNativeSeeked: () => void;
  onNativeEnded: () => void;
  onNativeTimeUpdate: (event: NativeSyntheticEvent<NativeTimeUpdateEvent>) => void;
  onNativeDurationChange: (event: NativeSyntheticEvent<NativeDurationChangeEvent>) => void;
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

interface THEOplayerRCTViewState extends LegacyTHEOplayerViewProps {
  isBuffering: boolean;
  error?: PlayerError;
}

interface THEOplayerViewNativeComponent extends HostComponent<LegacyTHEOplayerViewProps> {
  /**
   * Seek to a new position.
   *
   * @param seekTime - new time, in milliseconds.
   */
  seek: (seekTime: number) => void;
  /**
   * The API for advertisements.
   */
  ads: AdsAPI;

  /**
   * The API for casting devices.
   */
  cast: CastAPI;
  setNativeProps: (props: Partial<THEOplayerRCTViewProps>) => void;
}

export class THEOplayerView extends PureComponent<THEOplayerViewProps, THEOplayerRCTViewState> {
  private readonly _root: React.RefObject<THEOplayerViewNativeComponent>;
  private readonly _exposedPlayer: THEOplayerViewExposed;

  private static initialState: THEOplayerRCTViewState = {
    isBuffering: false,
    error: undefined,
    playbackRate: 1,
    volume: 1,
    muted: false,
    paused: true,
    fullscreen: false,
    selectedTextTrack: undefined,
    selectedVideoTrack: undefined,
    targetVideoQuality: undefined,
    selectedAudioTrack: undefined,
  };

  constructor(props: THEOplayerRCTViewProps) {
    super(props);
    this._root = React.createRef();
    this.state = THEOplayerView.initialState;
    this._exposedPlayer = new THEOplayerViewExposed(this);
    this.props.onReady?.(this._exposedPlayer);
  }

  componentWillUnmount() {
    if (Platform.OS === 'ios') {
      // on iOS, we trigger an explicit 'destroy' to clean up the underlying THEOplayer
      this.destroyTheoPlayer();
    }
  }

  private destroyTheoPlayer() {
    const node = findNodeHandle(this._root.current);
    const command = (UIManager as { [index: string]: any })['THEOplayerRCTView'].Commands.destroy;
    const params: any[] = [];
    UIManager.dispatchViewManagerCommand(node, command, params);
  }

  public seek(time: number): void {
    if (isNaN(time)) {
      throw new Error('Specified time is not a number');
    }
    this.setNativeProps({ seek: time });
  }

  public get nativeHandle(): number | null {
    return findNodeHandle(this._root.current);
  }

  private reset() {
    this.setState(THEOplayerView.initialState);
  }

  private setNativeProps(nativeProps: Partial<THEOplayerRCTViewProps>) {
    if (this._root?.current) {
      this._root.current.setNativeProps(nativeProps);
    }
  }

  private maybeChangeBufferingState(isBuffering: boolean) {
    const { isBuffering: wasBuffering, error } = this.state;
    const { paused } = this.state;

    // do not change state to buffering in case of an error or if the player is paused
    const newIsBuffering = isBuffering && !error && !paused;
    this.setState({ isBuffering: newIsBuffering });

    // notify change in buffering state
    if (newIsBuffering !== wasBuffering) {
      this._exposedPlayer.dispatchEvent(new DefaultBufferingChangeEvent(isBuffering));
    }
  }

  private _onSourceChange = () => {
    this.reset();
    this._exposedPlayer.dispatchEvent(new BaseEvent(PlayerEventType.SOURCE_CHANGE));
  };

  private _onLoadStart = () => {
    // potentially notify change in buffering state
    this.maybeChangeBufferingState(true);
    this._exposedPlayer.dispatchEvent(new BaseEvent(PlayerEventType.LOAD_START));
  };

  private _onLoadedData = () => {
    this._exposedPlayer.dispatchEvent(new BaseEvent(PlayerEventType.LOADED_DATA));
  };

  private _onLoadedMetadata = (event: NativeSyntheticEvent<NativeLoadedMetadataEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._exposedPlayer.dispatchEvent(
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
    this.maybeChangeBufferingState(false);
    this._exposedPlayer.dispatchEvent(new DefaultErrorEvent(event.nativeEvent.error));
  };

  private _onProgress = (event: NativeSyntheticEvent<NativeProgressEvent>) => {
    this._exposedPlayer.dispatchEvent(new DefaultProgressEvent(event.nativeEvent.seekable));
  };

  private _onPlay = () => {
    this._exposedPlayer.dispatchEvent(new BaseEvent(PlayerEventType.PLAY));
  };

  private _onPlaying = () => {
    this.maybeChangeBufferingState(false);
    this._exposedPlayer.dispatchEvent(new BaseEvent(PlayerEventType.PLAYING));
  };

  private _onPause = () => {
    this._exposedPlayer.dispatchEvent(new BaseEvent(PlayerEventType.PAUSE));
  };

  private _onSeeking = () => {
    this._exposedPlayer.dispatchEvent(new BaseEvent(PlayerEventType.SEEKING));
  };

  private _onSeeked = () => {
    this._exposedPlayer.dispatchEvent(new BaseEvent(PlayerEventType.SEEKED));
  };

  private _onEnded = () => {
    this._exposedPlayer.dispatchEvent(new BaseEvent(PlayerEventType.ENDED));
  };

  private _onReadStateChange = (event: NativeSyntheticEvent<NativeReadyStateChangeEvent>) => {
    this.maybeChangeBufferingState(event.nativeEvent.readyState < 3);
    this._exposedPlayer.dispatchEvent(new DefaultReadyStateChangeEvent(event.nativeEvent.readyState));
  };

  private _onTimeUpdate = (event: NativeSyntheticEvent<NativeTimeUpdateEvent>) => {
    this._exposedPlayer.dispatchEvent(new DefaultTimeupdateEvent(event.nativeEvent.currentTime, event.nativeEvent.currentProgramDateTime));
  };

  private _onDurationChange = (event: NativeSyntheticEvent<NativeDurationChangeEvent>) => {
    this._exposedPlayer.dispatchEvent(new DefaultDurationChangeEvent(decodeNanInf(event.nativeEvent.duration)));
  };

  private _onSegmentNotFound = (event: NativeSyntheticEvent<NativeSegmentNotFoundEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._exposedPlayer.dispatchEvent(new DefaultSegmentNotFoundEvent(nativeEvent.segmentStartTime, nativeEvent.error, nativeEvent.retryCount));
  };

  private _onTextTrackListEvent = (event: NativeSyntheticEvent<NativeTextTrackListEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._exposedPlayer.dispatchEvent(new DefaultTextTrackListEvent(toTrackListEventType(nativeEvent.type), nativeEvent.track));
  };

  private _onTextTrackEvent = (event: NativeSyntheticEvent<NativeTextTrackEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._exposedPlayer.dispatchEvent(new DefaultTextTrackEvent(toTextTrackEventType(nativeEvent.type), nativeEvent.trackUid, nativeEvent.cue));
  };

  private _onMediaTrackListEvent = (event: NativeSyntheticEvent<NativeMediaTrackListEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._exposedPlayer.dispatchEvent(
      new DefaultMediaTrackListEvent(toTrackListEventType(nativeEvent.type), toMediaTrackType(nativeEvent.trackType), nativeEvent.track),
    );
  };

  private _onMediaTrackEvent = (event: NativeSyntheticEvent<NativeMediaTrackEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._exposedPlayer.dispatchEvent(
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
    this._exposedPlayer.dispatchEvent(new DefaultAdEvent(nativeEvent.type, nativeEvent.ad));
  };

  private _onCastEvent = (event: NativeSyntheticEvent<NativeCastEvent>) => {
    switch (event.nativeEvent.type) {
      case CastEventType.CHROMECAST_STATE_CHANGE:
        this._exposedPlayer.dispatchEvent(new DefaultChromecastChangeEvent(event.nativeEvent.state));
        break;
      case CastEventType.AIRPLAY_STATE_CHANGE:
        this._exposedPlayer.dispatchEvent(new DefaultAirplayStateChangeEvent(event.nativeEvent.state));
        break;
      case CastEventType.CHROMECAST_ERROR:
        this._exposedPlayer.dispatchEvent(new DefaultChromecastErrorEvent(event.nativeEvent.error));
        break;
    }
  };

  private _onFullscreenPlayerWillPresent = () => {
    this._exposedPlayer.dispatchEvent(new DefaultFullscreenEvent(FullscreenActionType.PLAYER_WILL_PRESENT));
  };

  private _onFullscreenPlayerDidPresent = () => {
    this._exposedPlayer.dispatchEvent(new DefaultFullscreenEvent(FullscreenActionType.PLAYER_DID_PRESENT));
  };

  private _onFullscreenPlayerWillDismiss = () => {
    this._exposedPlayer.dispatchEvent(new DefaultFullscreenEvent(FullscreenActionType.PLAYER_WILL_DISMISS));
  };

  private _onFullscreenPlayerDidDismiss = () => {
    this._exposedPlayer.dispatchEvent(new DefaultFullscreenEvent(FullscreenActionType.PLAYER_DID_DISMISS));
  };

  private buildWrapperProps(): LegacyTHEOplayerViewProps {
    const { targetVideoQuality } = this.state;
    return Object.assign(
      {},
      {
        ...this.props,
        ...this.state,
        // Always pass an array for targetVideoQuality.
        targetVideoQuality: !targetVideoQuality ? [] : Array.isArray(targetVideoQuality) ? targetVideoQuality : [targetVideoQuality],
      },
    );
  }

  public render(): JSX.Element {
    console.log('rendering');
    const wrapperProps = this.buildWrapperProps();
    return (
      <View style={[styles.base, wrapperProps.style]}>
        <THEOplayerRCTView
          ref={this._root}
          src={this.state.source || {}}
          onNativeSourceChange={this._onSourceChange}
          onNativeLoadStart={this._onLoadStart}
          onNativeLoadedData={this._onLoadedData}
          onNativeLoadedMetadata={this._onLoadedMetadata}
          onNativeError={this._onError}
          onNativeProgress={this._onProgress}
          onNativePlay={this._onPlay}
          onNativePlaying={this._onPlaying}
          onNativePause={this._onPause}
          onNativeSeeking={this._onSeeking}
          onNativeSeeked={this._onSeeked}
          onNativeEnded={this._onEnded}
          onNativeReadyStateChange={this._onReadStateChange}
          onNativeTimeUpdate={this._onTimeUpdate}
          onNativeDurationChange={this._onDurationChange}
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
          style={StyleSheet.absoluteFill}
          {...wrapperProps}
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
