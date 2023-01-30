import { DefaultEventDispatcher } from './event/DefaultEventDispatcher';
import type {
  ABRConfiguration,
  AdsAPI,
  CastAPI,
  DurationChangeEvent,
  RateChangeEvent,
  LoadedMetadataEvent,
  MediaTrack,
  PlayerEventMap,
  SourceDescription,
  TextTrack,
  THEOplayer,
  THEOplayerView,
  TimeUpdateEvent,
} from 'react-native-theoplayer';
import { PlayerEventType, PreloadType } from 'react-native-theoplayer';
import { THEOplayerNativeAdsAdapter } from './ads/THEOplayerNativeAdsAdapter';
import { THEOplayerNativeCastAdapter } from './cast/THEOplayerNativeCastAdapter';
import { DefaultVolumeChangeEvent } from './event/PlayerEvents';
import { AbrAdapter } from './abr/AbrAdapter';
import { NativeModules, Platform } from 'react-native';

export class THEOplayerAdapter extends DefaultEventDispatcher<PlayerEventMap> implements THEOplayer {
  private readonly _view: THEOplayerView;
  private readonly _adsAdapter: THEOplayerNativeAdsAdapter;
  private readonly _castAdapter: THEOplayerNativeCastAdapter;
  private readonly _abrAdapter: AbrAdapter;

  private _source: SourceDescription | undefined = undefined;
  private _autoplay = false;
  private _paused = false;
  private _fullscreen = false;
  private _muted = false;
  private _seeking = false;
  private _volume = 1;
  private _currentTime = NaN;
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
    this.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    this.addEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    this.addEventListener(PlayerEventType.PAUSE, this.onPause);
    this.addEventListener(PlayerEventType.TIME_UPDATE, this.onTimeupdate);
    this.addEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    this.addEventListener(PlayerEventType.RATE_CHANGE, this.onRateChange);
    this.addEventListener(PlayerEventType.SEEKING, this.onSeeking);
    this.addEventListener(PlayerEventType.SEEKED, this.onSeeked);
  }

  private onSourceChange = () => {
    this._playbackRate = 1;
    this._seeking = false;
    this._audioTracks = [];
    this._videoTracks = [];
    this._textTracks = [];
    this._selectedTextTrack = undefined;
    this._selectedVideoTrack = undefined;
    this._selectedAudioTrack = undefined;
    this._targetVideoQuality = undefined;

    if (this._autoplay) {
      this.play();
    } else {
      this.pause();
    }
  };

  private onPause = () => {
    this._paused = true;
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

  get cast(): CastAPI {
    return this._castAdapter;
  }

  get currentTime(): number {
    return this._currentTime;
  }

  set currentTime(currentTime: number) {
    NativeModules.PlayerModule.setCurrentTime(this._view.nativeHandle, currentTime);
  }

  get duration(): number {
    return this._duration;
  }

  get fullscreen(): boolean {
    // TODO: rename to presentationState?
    return this._fullscreen;
  }

  set fullscreen(fullscreen: boolean) {
    // TODO: rename to presentationState?
    NativeModules.PlayerModule.setFullscreen(this._view.nativeHandle, fullscreen);
  }

  get muted(): boolean {
    return this._muted;
  }

  set muted(muted: boolean) {
    this._muted = muted;
    NativeModules.PlayerModule.setMuted(this._view.nativeHandle, muted);
    this.dispatchEvent(new DefaultVolumeChangeEvent(this.volume));
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
    NativeModules.PlayerModule.setSelectedTextTrack(this._view.nativeHandle, trackUid || -1);
  }

  get source(): SourceDescription | undefined {
    return this._source;
  }

  set source(source: SourceDescription | undefined) {
    // This is to correctly reset autoplay during a source change.
    this.pause();
    this._source = source;
    NativeModules.PlayerModule.setSource(this._view.nativeHandle, source);
  }

  get targetVideoQuality(): number | number[] | undefined {
    return this._targetVideoQuality;
  }

  set targetVideoQuality(target: number | number[] | undefined) {
    // Always pass an array for targetVideoQuality.
    this._targetVideoQuality = !target ? [] : Array.isArray(target) ? target : [target];
    NativeModules.PlayerModule.setTargetVideoQuality(this._view.nativeHandle, this._targetVideoQuality);
  }

  get volume(): number {
    return this._volume;
  }

  set volume(volume: number) {
    this._volume = volume;
    NativeModules.PlayerModule.setVolume(this._view.nativeHandle, volume);
    this.dispatchEvent(new DefaultVolumeChangeEvent(volume));
  }

  pause(): void {
    this._paused = true;
    NativeModules.PlayerModule.setPaused(this._view.nativeHandle, true);
  }

  play(): void {
    this._paused = false;
    NativeModules.PlayerModule.setPaused(this._view.nativeHandle, false);
  }
}
