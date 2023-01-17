import React, { PureComponent } from 'react';

import type { AdEvent, AdsAPI, CastAPI,MediaTrack, PlayerError, TextTrack, THEOplayerViewProps, TimeRange } from '@wouterds/react-native-theoplayer';
import {
  AdEventNames,
  MediaTrackEventType,
  MediaTrackType,
  TextTrackEventType,
  THEOplayerViewComponent,
  TrackListEventType,
} from '@wouterds/react-native-theoplayer';
import type { Event, TextTrackCue as NativeTextTrackCue, TrackChangeEvent } from 'theoplayer';

import type {
  AddTrackEvent,
  MediaTrack as NativeMediaTrack,
  PresentationModeChangeEvent,
  ReadyStateChangeEvent as NativeReadyStateChangeEvent,
  RemoveTrackEvent,
  TextTrack as NativeTextTrack,
} from 'theoplayer';
import * as THEOplayer from 'theoplayer';
import { findNativeQualitiesByUid, fromNativeCue, fromNativeMediaTrack, fromNativeTextTrack } from './web/TrackUtils';
import { THEOplayerWebAdsAPI } from './ads/THEOplayerWebAdsAPI';
import { THEOplayerWebCastAPI } from './cast/THEOplayerWebCastApi';

interface THEOplayerRCTViewState {
  isBuffering: boolean;
  error?: PlayerError;
}

export class THEOplayerView extends PureComponent<THEOplayerViewProps, THEOplayerRCTViewState> implements THEOplayerViewComponent {
  private _player: THEOplayer.ChromelessPlayer | null = null;
  private readonly _adsApi: THEOplayerWebAdsAPI;
  private readonly _castApi: THEOplayerWebCastAPI;

  private static initialState: THEOplayerRCTViewState = {
    isBuffering: false,
    error: undefined,
  };

  constructor(props: THEOplayerViewProps) {
    super(props);
    this.state = THEOplayerView.initialState;
    this._adsApi = new THEOplayerWebAdsAPI(this);
    this._castApi = new THEOplayerWebCastAPI(this);
  }

  componentDidMount() {
    const { config, source, abrConfig } = this.props;
    const element = document.querySelector('.theoplayer-container') as HTMLElement;
    if (config?.chromeless === true || config?.chromeless === undefined) {
      this._player = new THEOplayer.ChromelessPlayer(element, {
        libraryLocation: 'node_modules/theoplayer',
        ...config,
      });
    } else {
      this._player = new THEOplayer.Player(element, {
        libraryLocation: 'node_modules/theoplayer',
        ...config,
        ui: {
          fluid: true,
        },
      });
    }

    Object.assign(this._player.abr, abrConfig);
    this._player.prepareWithUserAction();
    this._player.source = source;
    this.addEventListeners();
  }

  componentWillUnmount() {
    if (this._player) {
      this._player.destroy();
    }
  }

  public seek(time: number): void {
    if (isNaN(time)) {
      throw new Error('Specified time is not a number');
    }
    if (this._player) {
      this._player.currentTime = time / 1e3;
    }
  }

  public get ads(): AdsAPI {
    return this._adsApi;
  }

  public get cast(): CastAPI {
    return this._castApi;
  }

  public get nativePlayer(): THEOplayer.ChromelessPlayer | null {
    return this._player;
  }

  private reset() {
    this.setState(THEOplayerView.initialState);
  }

  componentDidUpdate(prevProps: Readonly<THEOplayerViewProps>) {
    if (!this._player) {
      return;
    }
    // track property changes
    const { paused, volume, selectedTextTrack, selectedAudioTrack, selectedVideoTrack, targetVideoQuality, source, muted, playbackRate, fullscreen } =
      this.props;
    const {
      paused: wasPaused,
      selectedTextTrack: prevSelectedTextTrack,
      selectedAudioTrack: prevSelectedAudioTrack,
      selectedVideoTrack: prevSelectedVideoTrack,
      targetVideoQuality: prevTargetVideoQuality,
      source: prevSource,
      muted: wasMuted,
      playbackRate: prevPlaybackRate,
      fullscreen: wasFullscreen,
      volume: prevVolume,
    } = prevProps;

    if (source !== prevSource) {
      this._player.source = source;
    }
    if (paused !== wasPaused) {
      if (paused) {
        this._player.pause();
      } else {
        this._player.play();
      }
    }
    if (muted !== wasMuted) {
      this._player.muted = Boolean(muted);
    }
    if (volume !== prevVolume) {
      this._player.volume = Number(volume);
    }
    if (fullscreen !== wasFullscreen) {
      const { onFullscreenPlayerWillPresent, onFullscreenPlayerWillDismiss } = this.props;
      const appContainer = document.getElementById('app');
      if (fullscreen) {
        if (onFullscreenPlayerWillPresent) {
          onFullscreenPlayerWillPresent();
        }
        appContainer?.requestFullscreen().then();
      } else {
        if (onFullscreenPlayerWillDismiss) {
          onFullscreenPlayerWillDismiss();
        }
        document.exitFullscreen().then();
      }
    }
    if (playbackRate && playbackRate !== prevPlaybackRate) {
      this._player.playbackRate = playbackRate;
    }
    if (selectedTextTrack !== prevSelectedTextTrack) {
      this._player.textTracks.forEach((textTrack: NativeTextTrack) => {
        textTrack.mode = textTrack.uid === selectedTextTrack ? 'showing' : 'disabled';
      });
    }
    if (selectedAudioTrack !== prevSelectedAudioTrack) {
      this._player.audioTracks.forEach((audioTrack: NativeMediaTrack) => {
        audioTrack.enabled = audioTrack.uid === selectedAudioTrack;
      });
    }
    if (selectedVideoTrack !== prevSelectedVideoTrack) {
      this._player.videoTracks.forEach((videoTrack: NativeMediaTrack) => {
        videoTrack.enabled = videoTrack.uid === selectedVideoTrack;
      });
    }
    if (targetVideoQuality != prevTargetVideoQuality) {
      const videoTrack = this._player.videoTracks.find((videoTrack: NativeMediaTrack) => videoTrack.uid === selectedVideoTrack);
      if (videoTrack) {
        videoTrack.targetQuality = findNativeQualitiesByUid(videoTrack, targetVideoQuality);
      }
    }
  }

  private maybeChangeBufferingState(isBuffering: boolean) {
    const { isBuffering: wasBuffering, error } = this.state;
    const { paused } = this.props;

    // do not change state to buffering in case of an error or if the player is paused
    const newIsBuffering = isBuffering && !error && !paused;
    this.setState({ isBuffering: newIsBuffering });

    // notify change in buffering state
    if (newIsBuffering !== wasBuffering && this.props.onBufferingStateChange) {
      this.props.onBufferingStateChange(newIsBuffering);
    }
  }

  private onAddTextTrackCue = (track: NativeTextTrack) => (event: Event<'addcue'>) => {
    const { onTextTrackEvent } = this.props;
    if (onTextTrackEvent) {
      const { cue } = event as unknown as { cue: NativeTextTrackCue };
      if (cue) {
        onTextTrackEvent({
          type: TextTrackEventType.AddCue,
          trackUid: track.uid,
          cue: fromNativeCue(cue),
        });
      }
    }
  };

  private onRemoveTextTrackCue = (track: NativeTextTrack) => (event: Event<'removecue'>) => {
    const { onTextTrackEvent } = this.props;
    if (onTextTrackEvent) {
      const { cue } = event as unknown as { cue: NativeTextTrackCue };
      if (cue) {
        onTextTrackEvent({
          type: TextTrackEventType.RemoveCue,
          trackUid: track.uid,
          cue: fromNativeCue(cue),
        });
      }
    }
  };

  private onActiveQualityChanged = (trackType: MediaTrackType, track: NativeMediaTrack) => () => {
    const { onMediaTrackEvent } = this.props;
    if (onMediaTrackEvent) {
      const quality = track.activeQuality;
      onMediaTrackEvent({
        type: MediaTrackEventType.ActiveQualityChanged,
        trackType,
        trackUid: track.uid,
        qualities: quality ? [quality] : undefined,
      });
    }
  };

  private addEventListeners() {
    const player = this._player;
    if (!player) {
      return;
    }

    player.addEventListener('sourcechange', () => {
      const { onSourceChange, paused } = this.props;

      this.reset();
      if (!paused) {
        player.play();
      }
      if (onSourceChange) {
        onSourceChange();
      }
    });

    player.addEventListener('loadstart', () => {
      // potentially notify change in buffering state
      this.maybeChangeBufferingState(true);

      const { onLoadStart } = this.props;
      if (onLoadStart) {
        onLoadStart();
      }
    });

    player.addEventListener('loadeddata', () => {
      const { onLoadedData } = this.props;
      if (onLoadedData) {
        onLoadedData();
      }
    });

    player.addEventListener('loadedmetadata', () => {
      const { onLoadedMetadata } = this.props;
      if (onLoadedMetadata) {
        onLoadedMetadata({
          textTracks: player.textTracks.map((textTrack: NativeTextTrack) => fromNativeTextTrack(textTrack)),
          audioTracks: player.audioTracks.map((audioTrack: NativeMediaTrack) => fromNativeMediaTrack(audioTrack)),
          videoTracks: player.videoTracks.map((videoTrack: NativeMediaTrack) => fromNativeMediaTrack(videoTrack)),
          duration: 1e3 * player.duration,
          selectedTextTrack: player.textTracks.find((track: NativeTextTrack) => track.mode === 'showing')?.uid,
          selectedVideoTrack: player.videoTracks.find((track: NativeMediaTrack) => track.enabled)?.uid,
          selectedAudioTrack: player.audioTracks.find((track: NativeMediaTrack) => track.enabled)?.uid,
        });
      }
    });

    player.addEventListener('error', (event) => {
      const { errorObject } = event;
      const error = {
        errorCode: errorObject.code.toString(),
        errorMessage: errorObject.message,
      };
      this.setState({ error });

      // potentially notify change in buffering state
      this.maybeChangeBufferingState(false);

      const { onError } = this.props;
      if (onError) {
        onError({ error });
      }
    });

    player.addEventListener('progress', () => {
      const { onProgress } = this.props;
      if (onProgress) {
        const seekable: TimeRange[] = [];
        for (let i = 0; i < player.seekable.length; i++) {
          seekable.push({
            start: player.seekable.start(i) * 1e3,
            end: player.seekable.end(i) * 1e3,
          });
        }
        onProgress({ seekable });
      }
    });

    player.addEventListener('play', () => {
      const { onPlay } = this.props;
      if (onPlay) {
        onPlay();
      }
    });

    player.addEventListener('playing', () => {
      // potentially notify change in buffering state
      this.maybeChangeBufferingState(false);

      const { onPlaying } = this.props;
      if (onPlaying) {
        onPlaying();
      }
    });

    player.addEventListener('pause', () => {
      const { onPause } = this.props;
      if (onPause) {
        onPause();
      }
    });

    player.addEventListener('seeking', () => {
      const { onSeeking } = this.props;
      if (onSeeking) {
        onSeeking();
      }
    });

    player.addEventListener('seeked', () => {
      const { onSeeked } = this.props;
      if (onSeeked) {
        onSeeked();
      }
    });

    player.addEventListener('ended', () => {
      const { onEnded } = this.props;
      if (onEnded) {
        onEnded();
      }
    });

    player.addEventListener('readystatechange', (event: NativeReadyStateChangeEvent) => {
      // potentially notify change in buffering state
      this.maybeChangeBufferingState(event.readyState < 3);

      const { onReadyStateChange } = this.props;
      if (onReadyStateChange) {
        onReadyStateChange({ readyState: event.readyState });
      }
    });

    player.addEventListener('timeupdate', () => {
      const { onTimeUpdate } = this.props;
      if (onTimeUpdate) {
        onTimeUpdate({
          currentTime: player.currentTime * 1e3,
          currentProgramDateTime: player.currentProgramDateTime?.getTime(),
        });
      }
    });
    player.addEventListener('durationchange', (event) => {
      const { onDurationChange } = this.props;
      if (onDurationChange) {
        onDurationChange({
          duration: event.duration * 1e3,
        });
      }
    });
    player.addEventListener('segmentnotfound', () => {
      const { onSegmentNotFound } = this.props;
      if (onSegmentNotFound) {
        onSegmentNotFound({
          segmentStartTime: 0,
          error: 'Segment not found',
          retryCount: -1,
        });
      }
    });

    player.presentation.addEventListener('presentationmodechange', (event: PresentationModeChangeEvent) => {
      const { presentationMode } = event;
      const { onFullscreenPlayerDidPresent, onFullscreenPlayerDidDismiss } = this.props;
      if (presentationMode === 'fullscreen') {
        if (onFullscreenPlayerDidPresent) {
          onFullscreenPlayerDidPresent();
        }
      } else if (presentationMode === 'inline') {
        if (onFullscreenPlayerDidDismiss) {
          onFullscreenPlayerDidDismiss();
        }
      }
    });

    player.textTracks.addEventListener('addtrack', (event: AddTrackEvent) => {
      const track = event.track as NativeTextTrack;
      track.addEventListener('addcue', this.onAddTextTrackCue(track));
      track.addEventListener('removecue', this.onRemoveTextTrackCue(track));
      this.dispatchTextTrackListEvent(TrackListEventType.AddTrack, track as TextTrack);
    });

    player.textTracks.addEventListener('removetrack', (event: RemoveTrackEvent) => {
      const track = event.track as NativeTextTrack;
      track.removeEventListener('addcue', this.onAddTextTrackCue(track));
      track.removeEventListener('removecue', this.onRemoveTextTrackCue(track));
      this.dispatchTextTrackListEvent(TrackListEventType.RemoveTrack, track as NativeTextTrack as TextTrack);
    });

    player.textTracks.addEventListener('change', (event: TrackChangeEvent) => {
      this.dispatchTextTrackListEvent(TrackListEventType.ChangeTrack, event.track as NativeTextTrack as TextTrack);
    });

    [MediaTrackType.Audio, MediaTrackType.Video].forEach((trackType) => {
      const mediaTracks = trackType === MediaTrackType.Audio ? player.audioTracks : player.videoTracks;
      mediaTracks.addEventListener('addtrack', (event: AddTrackEvent) => {
        const track = event.track as NativeMediaTrack;
        track.addEventListener('activequalitychanged', this.onActiveQualityChanged(trackType, track));
        this.dispatchMediaTrackListEvent(TrackListEventType.AddTrack, trackType, track as MediaTrack);
      });
    });

    [MediaTrackType.Audio, MediaTrackType.Video].forEach((trackType) => {
      const mediaTracks = trackType === MediaTrackType.Audio ? player.audioTracks : player.videoTracks;
      mediaTracks.addEventListener('removetrack', (event: RemoveTrackEvent) => {
        const track = event.track as NativeMediaTrack;
        track.removeEventListener('activequalitychanged', this.onActiveQualityChanged(trackType, track));
        this.dispatchMediaTrackListEvent(TrackListEventType.RemoveTrack, trackType, track as MediaTrack);
      });
    });

    [MediaTrackType.Audio, MediaTrackType.Video].forEach((trackType) => {
      const mediaTracks = trackType === MediaTrackType.Audio ? player.audioTracks : player.videoTracks;
      mediaTracks.addEventListener('change', (event: TrackChangeEvent) => {
        const track = event.track as NativeMediaTrack;
        this.dispatchMediaTrackListEvent(TrackListEventType.ChangeTrack, trackType, track as MediaTrack);
      });
    });

    player.ads?.addEventListener(AdEventNames, (event) => {
      const { onAdEvent } = this.props;
      if (onAdEvent) {
        onAdEvent(event as AdEvent);
      }
    });
  }

  private dispatchTextTrackListEvent = (type: TrackListEventType, track: TextTrack) => {
    const { onTextTrackListEvent } = this.props;
    if (onTextTrackListEvent) {
      onTextTrackListEvent({
        type,
        track,
      });
    }
  };

  private dispatchMediaTrackListEvent = (type: TrackListEventType, trackType: MediaTrackType, track: MediaTrack) => {
    const { onMediaTrackListEvent } = this.props;
    if (onMediaTrackListEvent) {
      onMediaTrackListEvent({
        type,
        trackType,
        track: track as MediaTrack,
      });
    }
  };

  public render(): JSX.Element {
    const { config } = this.props;
    const chromeless = config?.chromeless === undefined || config?.chromeless === true;

    return (
      <div id={'theoplayer-wrapper'}>
        <div className={chromeless ? 'theoplayer-container' : 'theoplayer-container video-js theoplayer-skin'} />
      </div>
    );
  }
}
