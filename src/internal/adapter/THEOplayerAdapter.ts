import { DefaultEventDispatcher } from './event/DefaultEventDispatcher';
import type {
  ABRConfiguration,
  AdsAPI,
  CastAPI,
  DurationChangeEvent,
  LoadedMetadataEvent,
  MediaTrack,
  MediaTrackEvent,
  MediaTrackListEvent,
  NativeHandleType,
  PiPConfiguration,
  PlayerEventMap,
  PresentationMode,
  PresentationModeChangeEvent,
  ProgressEvent,
  RateChangeEvent,
  SourceDescription,
  TextTrack,
  TextTrackListEvent,
  THEOplayer,
  THEOplayerView,
  TimeRange,
  TimeUpdateEvent,
} from 'react-native-theoplayer';
import {
  addTrack,
  findMediaTrackByUid,
  MediaTrackEventType,
  MediaTrackType,
  PlayerEventType,
  PreloadType,
  removeTrack,
  TextTrackStyle,
  TrackListEventType,
} from 'react-native-theoplayer';
import { THEOplayerNativeAdsAdapter } from './ads/THEOplayerNativeAdsAdapter';
import { THEOplayerNativeCastAdapter } from './cast/THEOplayerNativeCastAdapter';
import { AbrAdapter } from './abr/AbrAdapter';
import { NativeModules, Platform } from 'react-native';
import { TextTrackStyleAdapter } from './track/TextTrackStyleAdapter';
import type { BackgroundAudioConfiguration } from 'src/api/backgroundAudio/BackgroundAudioConfiguration';

export class THEOplayerAdapter extends DefaultEventDispatcher<PlayerEventMap> implements THEOplayer {
  private readonly _view: THEOplayerView;
  private readonly _adsAdapter: THEOplayerNativeAdsAdapter;
  private readonly _castAdapter: THEOplayerNativeCastAdapter;
  private readonly _abrAdapter: AbrAdapter;
  private readonly _textTrackStyleAdapter: TextTrackStyleAdapter;

  private _source: SourceDescription | undefined = undefined;
  private _autoplay = false;
  private _paused = false;
  private _seekable: TimeRange[] = [];
  private _buffered: TimeRange[] = [];
  private _pipConfig: PiPConfiguration = { startsAutomatically: false, requiresLinearPlayback: false }
  private _backgroundAudioConfig: BackgroundAudioConfiguration = { enabled: false }
  private _presentationMode: PresentationMode = 'inline';
  private _muted = false;
  private _seeking = false;
  private _volume = 1;
  private _currentTime = 0;
  private _duration = NaN;
  private _playbackRate = 1;
  private _preload: PreloadType = 'none';
  private _audioTracks: MediaTrack[] = [];
  private _videoTracks: MediaTrack[] = [];
  private _textTracks: TextTrack[] = [];
  private _targetVideoQuality: number | number[] | undefined = undefined;
  private _selectedVideoTrack: number | undefined = undefined;
  private _selectedAudioTrack: number | undefined = undefined;
  private _selectedTextTrack: number | undefined = undefined;

  constructor(view: THEOplayerView) {
    super();
    this._view = view;
    this._adsAdapter = new THEOplayerNativeAdsAdapter(this._view);
    this._castAdapter = new THEOplayerNativeCastAdapter(this._view);
    this._abrAdapter = new AbrAdapter(this._view);
    this._textTrackStyleAdapter = new TextTrackStyleAdapter(this._view);

    this.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    this.addEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    this.addEventListener(PlayerEventType.PAUSE, this.onPause);
    this.addEventListener(PlayerEventType.PLAYING, this.onPlaying);
    this.addEventListener(PlayerEventType.TIME_UPDATE, this.onTimeupdate);
    this.addEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    this.addEventListener(PlayerEventType.RATE_CHANGE, this.onRateChange);
    this.addEventListener(PlayerEventType.SEEKING, this.onSeeking);
    this.addEventListener(PlayerEventType.SEEKED, this.onSeeked);
    this.addEventListener(PlayerEventType.PROGRESS, this.onProgress);
    this.addEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackList);
    this.addEventListener(PlayerEventType.MEDIA_TRACK, this.onMediaTrack);
    this.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onMediaTrackList);
    this.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, this.onPresentationModeChange);
  }

  private onSourceChange = () => {
    if (this._autoplay) {
      this.play();
    } else {
      this.pause();
    }
  };

  private onPause = () => {
    this._paused = true;
  };

  private onPlaying = () => {
    this._paused = false;
  };

  private onPresentationModeChange = (event: PresentationModeChangeEvent) => {
    this._presentationMode = event.presentationMode;
  };

  private onTimeupdate = (event: TimeUpdateEvent) => {
    this._currentTime = event.currentTime;
  };

  private onLoadedMetadata = (event: LoadedMetadataEvent) => {
    this._duration = event.duration;
    this._audioTracks = event.audioTracks;
    this._videoTracks = event.videoTracks;
    this._textTracks = event.textTracks;
    this._selectedAudioTrack = event.selectedAudioTrack;
    this._selectedVideoTrack = event.selectedVideoTrack;
    this._selectedTextTrack = event.selectedTextTrack;
  };

  private onDurationChange = (event: DurationChangeEvent) => {
    this._duration = event.duration;
  };

  private onRateChange = (event: RateChangeEvent) => {
    this._playbackRate = event.playbackRate;
  };

  private onSeeking = () => {
    this._seeking = true;
  };

  private onSeeked = () => {
    this._seeking = false;
  };

  private onProgress = (event: ProgressEvent) => {
    this._seekable = event.seekable;
    this._buffered = event.buffered;
  };

  private onTextTrackList = (event: TextTrackListEvent) => {
    const { subType, track } = event;
    switch (subType) {
      case TrackListEventType.ADD_TRACK:
        this._textTracks = addTrack(this._textTracks, track);
        break;
      case TrackListEventType.REMOVE_TRACK:
        this._textTracks = removeTrack(this._textTracks, track);
        break;
      case TrackListEventType.CHANGE_TRACK:
        this._textTracks = removeTrack(this._textTracks, track);
        this._textTracks = addTrack(this._textTracks, track);
        break;
    }
  };

  private onMediaTrack = (event: MediaTrackEvent) => {
    const { subType, trackType, trackUid } = event;
    const tracks = trackType === MediaTrackType.VIDEO ? this._videoTracks : this._audioTracks;
    const track = findMediaTrackByUid(tracks, trackUid);
    switch (subType) {
      case MediaTrackEventType.ACTIVE_QUALITY_CHANGED:
        // Update local state
        if (track) {
          Object.assign(track, { ...track, activeQuality: event.qualities });
        }
        break;
    }
  };

  private onMediaTrackList = (event: MediaTrackListEvent) => {
    const { subType, trackType, track } = event;
    const isAudio = trackType === MediaTrackType.AUDIO;
    switch (subType) {
      case TrackListEventType.ADD_TRACK:
        if (isAudio) {
          this._audioTracks = addTrack(this._audioTracks, track);
        } else {
          this._videoTracks = addTrack(this._videoTracks, track);
        }
        break;
      case TrackListEventType.REMOVE_TRACK:
        if (isAudio) {
          this._audioTracks = removeTrack(this._audioTracks, track);
        } else {
          this._videoTracks = removeTrack(this._videoTracks, track);
        }
        break;
      case TrackListEventType.CHANGE_TRACK:
        if (isAudio) {
          this._audioTracks = removeTrack(this._audioTracks, track);
          this._audioTracks = addTrack(this._audioTracks, track);
        } else {
          this._videoTracks = removeTrack(this._videoTracks, track);
          this._videoTracks = addTrack(this._videoTracks, track);
        }
        break;
    }
  };

  get abr(): ABRConfiguration | undefined {
    return Platform.OS === 'android' ? this._abrAdapter : undefined;
  }

  get ads(): AdsAPI {
    return this._adsAdapter;
  }

  set autoplay(autoplay: boolean) {
    this._autoplay = autoplay;
    NativeModules.PlayerModule.setPaused(this._view.nativeHandle, !autoplay);
  }

  get autoplay(): boolean {
    return this._autoplay;
  }

  set preload(type: PreloadType) {
    this._preload = type;
    NativeModules.PlayerModule.setPreload(this._view.nativeHandle, type);
  }

  get preload(): PreloadType {
    return this._preload;
  }

  get seekable() {
    return this._seekable;
  }

  get buffered() {
    return this._buffered;
  }

  get cast(): CastAPI {
    return this._castAdapter;
  }

  get currentTime(): number {
    return this._currentTime;
  }

  set currentTime(currentTime: number) {
    this._currentTime = currentTime;
    NativeModules.PlayerModule.setCurrentTime(this._view.nativeHandle, currentTime);
  }

  get duration(): number {
    return this._duration;
  }

  get pipConfiguration(): PiPConfiguration {
    return this._pipConfig;
  }

  set pipConfiguration(pipConfiguration: PiPConfiguration) {
    this._pipConfig = pipConfiguration;
    NativeModules.PlayerModule.setPipConfig(pipConfiguration);
  }

  get backgroundAudioConfiguration(): BackgroundAudioConfiguration {
    return this._backgroundAudioConfig;
  }

  set backgroundAudioConfiguration(backgroundAudioConfiguration: BackgroundAudioConfiguration) {
    this._backgroundAudioConfig = backgroundAudioConfiguration;
    NativeModules.PlayerModule.setBackgroundAudioConfig(backgroundAudioConfiguration);
  }

  get presentationMode(): PresentationMode {
    return this._presentationMode;
  }

  set presentationMode(presentationMode: PresentationMode) {
    this._presentationMode = presentationMode;
    NativeModules.PlayerModule.setPresentationMode(this._view.nativeHandle, presentationMode);
  }

  get muted(): boolean {
    return this._muted;
  }

  set muted(muted: boolean) {
    this._muted = muted;
    NativeModules.PlayerModule.setMuted(this._view.nativeHandle, muted);
  }

  get seeking(): boolean {
    return this._seeking;
  }

  get paused(): boolean {
    return this._paused;
  }

  get playbackRate(): number {
    return this._playbackRate;
  }

  set playbackRate(playbackRate: number) {
    this._playbackRate = playbackRate;
    NativeModules.PlayerModule.setPlaybackRate(this._view.nativeHandle, playbackRate);
  }

  get audioTracks(): MediaTrack[] {
    return this._audioTracks;
  }

  get selectedAudioTrack(): number | undefined {
    return this._selectedAudioTrack;
  }

  set selectedAudioTrack(trackUid: number | undefined) {
    this._selectedAudioTrack = trackUid;
    NativeModules.PlayerModule.setSelectedAudioTrack(this._view.nativeHandle, trackUid || -1);
  }

  get videoTracks(): MediaTrack[] {
    return this._videoTracks;
  }

  get selectedVideoTrack(): number | undefined {
    return this._selectedVideoTrack;
  }

  set selectedVideoTrack(trackUid: number | undefined) {
    this._selectedVideoTrack = trackUid;
    this._targetVideoQuality = undefined;
    NativeModules.PlayerModule.setSelectedVideoTrack(this._view.nativeHandle, trackUid || -1);
  }

  get textTracks(): TextTrack[] {
    return this._textTracks;
  }

  get selectedTextTrack(): number | undefined {
    return this._selectedTextTrack;
  }

  set selectedTextTrack(trackUid: number | undefined) {
    this._selectedTextTrack = trackUid;
    this.textTracks.forEach((track) => {
      if (track.uid == trackUid) {
        track.mode = 'showing';
      } else if (track.mode === 'showing') {
        track.mode = 'disabled';
      }
    });
    NativeModules.PlayerModule.setSelectedTextTrack(this._view.nativeHandle, trackUid || -1);
  }

  get textTrackStyle(): TextTrackStyle {
    return this._textTrackStyleAdapter;
  }

  get source(): SourceDescription | undefined {
    return this._source;
  }

  set source(source: SourceDescription | undefined) {
    // This is to correctly reset autoplay during a source change.
    this.pause();
    this._source = source;
    NativeModules.PlayerModule.setSource(this._view.nativeHandle, source);
    // Reset state for playout of new source
    this._playbackRate = 1;
    this._seeking = false;
    this._audioTracks = [];
    this._videoTracks = [];
    this._textTracks = [];
    this._seekable = [];
    this._buffered = [];
    this._selectedTextTrack = undefined;
    this._selectedVideoTrack = undefined;
    this._selectedAudioTrack = undefined;
    this._targetVideoQuality = undefined;
  }

  get targetVideoQuality(): number | number[] | undefined {
    return this._targetVideoQuality;
  }

  set targetVideoQuality(target: number | number[] | undefined) {
    // Always pass an array for targetVideoQuality.
    this._targetVideoQuality = !target ? [] : Array.isArray(target) ? target : [target];

    // Update local state
    const track = findMediaTrackByUid(this._videoTracks, this.selectedVideoTrack);
    if (track) {
      Object.assign(track, { ...track, targetQuality: this._targetVideoQuality });
    }
    NativeModules.PlayerModule.setTargetVideoQuality(this._view.nativeHandle, this._targetVideoQuality);
  }

  get volume(): number {
    return this._volume;
  }

  set volume(volume: number) {
    this._volume = volume;
    NativeModules.PlayerModule.setVolume(this._view.nativeHandle, volume);
  }

  pause(): void {
    this._paused = true;
    NativeModules.PlayerModule.setPaused(this._view.nativeHandle, true);
  }

  play(): void {
    this._paused = false;
    NativeModules.PlayerModule.setPaused(this._view.nativeHandle, false);
  }

  get nativeHandle(): NativeHandleType {
    return this._view.nativeHandle;
  }
}
