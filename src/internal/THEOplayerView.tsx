import React, { PureComponent } from 'react';
import {
  default as THEOplayerRCTView,
  NativeAdEvent,
  NativeCastEvent,
  NativeDurationChangeEvent,
  NativeErrorEvent,
  NativeLoadedMetadataEvent,
  NativeMediaTrackEvent,
  NativeMediaTrackListEvent,
  NativePlayerStateEvent,
  NativePresentationModeChangeEvent,
  NativeProgressEvent,
  NativeRateChangeEvent,
  NativeReadyStateChangeEvent,
  NativeResizeEvent,
  NativeSegmentNotFoundEvent,
  NativeTextTrackEvent,
  NativeTextTrackListEvent,
  NativeTimeUpdateEvent,
  NativeVolumeChangeEvent,
} from '../specs/THEOplayerRCTViewNativeComponent';
import { Dimensions, findNodeHandle, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import type { ScaledSize, EmitterSubscription } from 'react-native';
import {
  Ad,
  AdBreak,
  AdEventType,
  CastState,
  ChromecastError,
  isDateRangeCue,
  MediaTrack,
  PlayerError,
  PresentationMode,
  PresentationModeChangeContext,
  Quality,
  TextTrack,
  TextTrackCue,
  THEOplayerViewProps,
} from 'react-native-theoplayer';
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
import { THEOplayerAdapter } from './adapter/THEOplayerAdapter';
import { getFullscreenSize } from './utils/Dimensions';
import { Poster } from './poster/Poster';
import type { NativePlayerState } from './adapter/NativePlayerState';
import { toMediaTrackType, toMediaTrackTypeEventType, toTextTrackEventType, toTrackListEventType } from './adapter/event/TrackEventUtils';

const INVALID_HANDLE = -1;

interface THEOplayerRCTViewState {
  error?: PlayerError;
  presentationMode?: PresentationMode | undefined;
  screenSize: ScaledSize;
  posterActive: boolean;
  poster: string | undefined;
}

export class THEOplayerView extends PureComponent<React.PropsWithChildren<THEOplayerViewProps>, THEOplayerRCTViewState> {
  private readonly _root: React.RefObject<any>;
  private readonly _facade: THEOplayerAdapter;
  private _dimensionsHandler?: EmitterSubscription = undefined;

  private static initialState: THEOplayerRCTViewState = {
    error: undefined,
    presentationMode: PresentationMode.inline,
    screenSize: getFullscreenSize(),
    posterActive: false,
    poster: undefined,
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
    this._facade.clearEventListeners();
  }

  public get nativeHandle(): number {
    return findNodeHandle(this._root.current) || INVALID_HANDLE;
  }

  private reset() {
    this.setState((prevState) => ({
      ...prevState,
      error: undefined,
    }));
  }

  private _onDimensionsChanged = () => {
    this.setState({ screenSize: getFullscreenSize() });
  };

  private _onNativePlayerReady = (event: NativeSyntheticEvent<NativePlayerStateEvent>) => {
    // Optionally apply an initial player state
    const { version, state } = event.nativeEvent;
    this._facade.initializeFromNativePlayer_(version, state as NativePlayerState).then(() => {
      this.props.onPlayerReady?.(this._facade);
    });
  };

  private _onSourceChange = () => {
    this.reset();
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.SOURCE_CHANGE));
    this._updatePoster();
    this._showPoster();
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
        nativeEvent.textTracks as TextTrack[],
        nativeEvent.audioTracks as MediaTrack[],
        nativeEvent.videoTracks as MediaTrack[],
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
    this._hidePoster();
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
    this._facade.dispatchEvent(new DefaultTextTrackListEvent(toTrackListEventType(nativeEvent.type), nativeEvent.track as TextTrack));
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
      new DefaultMediaTrackListEvent(
        toTrackListEventType(nativeEvent.type),
        toMediaTrackType(nativeEvent.trackType),
        nativeEvent.track as MediaTrack,
      ),
    );
  };

  private _onMediaTrackEvent = (event: NativeSyntheticEvent<NativeMediaTrackEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._facade.dispatchEvent(
      new DefaultMediaTrackEvent(
        toMediaTrackTypeEventType(nativeEvent.type),
        toMediaTrackType(nativeEvent.trackType),
        nativeEvent.trackUid,
        nativeEvent.qualities as Quality[],
      ),
    );
  };

  private _onAdEvent = (event: NativeSyntheticEvent<NativeAdEvent>) => {
    const nativeEvent = event.nativeEvent;
    this._facade.dispatchEvent(new DefaultAdEvent(nativeEvent.type as AdEventType, nativeEvent.ad as Ad | AdBreak));
  };

  private _onCastEvent = (event: NativeSyntheticEvent<NativeCastEvent>) => {
    switch (event.nativeEvent.type) {
      case CastEventType.CHROMECAST_STATE_CHANGE:
        this._facade.dispatchEvent(new DefaultChromecastChangeEvent(event.nativeEvent.state as CastState));
        break;
      case CastEventType.AIRPLAY_STATE_CHANGE:
        this._facade.dispatchEvent(new DefaultAirplayStateChangeEvent(event.nativeEvent.state as CastState));
        break;
      case CastEventType.CHROMECAST_ERROR:
        this._facade.dispatchEvent(new DefaultChromecastErrorEvent(event.nativeEvent.error as ChromecastError));
        break;
    }
  };

  private _onPresentationModeChange = (event: NativeSyntheticEvent<NativePresentationModeChangeEvent>) => {
    this.setState({ presentationMode: event.nativeEvent.presentationMode as PresentationMode });
    this._facade.dispatchEvent(
      new DefaultPresentationModeChangeEvent(
        event.nativeEvent.presentationMode as PresentationMode,
        event.nativeEvent.previousPresentationMode as PresentationMode,
        event.nativeEvent.context as PresentationModeChangeContext,
      ),
    );
  };

  private _onResize = (event: NativeSyntheticEvent<NativeResizeEvent>) => {
    this._facade.dispatchEvent(new DefaultResizeEvent(event.nativeEvent.width, event.nativeEvent.height));
  };

  private _updatePoster = () => {
    this.setState({ poster: this._facade.source?.poster });
  };

  private _showPoster = () => {
    this.setState({ posterActive: true });
  };

  private _hidePoster = () => {
    this.setState({ posterActive: false });
  };

  public render(): JSX.Element {
    const { config, style, posterStyle, children } = this.props;
    const { presentationMode, screenSize: fullscreenSize, posterActive, poster } = this.state;

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
        {posterActive && <Poster uri={poster} style={posterStyle} />}
        {children}
      </View>
    );
  }
}
