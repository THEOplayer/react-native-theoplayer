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
  TextTrackMode,
  TextTrackStyle,
  TrackListEventType,
} from 'react-native-theoplayer';
import { THEOplayerNativeAdsAdapter } from './ads/THEOplayerNativeAdsAdapter';
import { THEOplayerNativeCastAdapter } from './cast/THEOplayerNativeCastAdapter';
import { AbrAdapter } from './abr/AbrAdapter';
import { NativeModules, Platform } from 'react-native';
import { TextTrackStyleAdapter } from './track/TextTrackStyleAdapter';
import type { BackgroundAudioConfiguration } from 'src/api/backgroundAudio/BackgroundAudioConfiguration';
import type { NativePlayerState } from './NativePlayerState';

const defaultPlayerState: NativePlayerState = {
  source: undefined,
  autoplay: false,
  paused: false,
  seekable: [],
  buffered: [],
  pipConfig: { startsAutomatically: false },
  backgroundAudioConfig: { enabled: false },
  presentationMode: 'inline',
  muted: false,
  seeking: false,
  volume: 1,
  currentTime: 0,
  duration: NaN,
  playbackRate: 1,
  preload: 'none',
  audioTracks: [],
  videoTracks: [],
  textTracks: [],
  targetVideoQuality: undefined,
  selectedVideoTrack: undefined,
  selectedAudioTrack: undefined,
  selectedTextTrack: undefined,
};

export class THEOplayerAdapter extends DefaultEventDispatcher<PlayerEventMap> implements THEOplayer {
  private readonly _view: THEOplayerView;
  private readonly _state: NativePlayerState;
  private readonly _adsAdapter: THEOplayerNativeAdsAdapter;
  private readonly _castAdapter: THEOplayerNativeCastAdapter;
  private readonly _abrAdapter: AbrAdapter;
  private readonly _textTrackStyleAdapter: TextTrackStyleAdapter;

  constructor(view: THEOplayerView, initialState: NativePlayerState = defaultPlayerState) {
    super();
    this._view = view;
    this._state = { ...initialState };
    this._adsAdapter = new THEOplayerNativeAdsAdapter(this._view);
    this._castAdapter = new THEOplayerNativeCastAdapter(this, this._view);
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
    if (this._state.autoplay) {
      this.play();
    } else {
      this.pause();
    }
  };

  private onPause = () => {
    this._state.paused = true;
  };

  private onPlaying = () => {
    this._state.paused = false;
  };

  private onPresentationModeChange = (event: PresentationModeChangeEvent) => {
    this._state.presentationMode = event.presentationMode;
  };

  private onTimeupdate = (event: TimeUpdateEvent) => {
    this._state.currentTime = event.currentTime;
  };

  private onLoadedMetadata = (event: LoadedMetadataEvent) => {
    this._state.duration = event.duration;
    this._state.audioTracks = event.audioTracks;
    this._state.videoTracks = event.videoTracks;
    this._state.textTracks = event.textTracks;
    this._state.selectedAudioTrack = event.selectedAudioTrack;
    this._state.selectedVideoTrack = event.selectedVideoTrack;
    this._state.selectedTextTrack = event.selectedTextTrack;
  };

  private onDurationChange = (event: DurationChangeEvent) => {
    this._state.duration = event.duration;
  };

  private onRateChange = (event: RateChangeEvent) => {
    this._state.playbackRate = event.playbackRate;
  };

  private onSeeking = () => {
    this._state.seeking = true;
  };

  private onSeeked = () => {
    this._state.seeking = false;
  };

  private onProgress = (event: ProgressEvent) => {
    this._state.seekable = event.seekable?.sort((a, b) => a.end - b.end);
    this._state.buffered = event.buffered?.sort((a, b) => a.end - b.end);
  };

  private onTextTrackList = (event: TextTrackListEvent) => {
    const { subType, track } = event;
    switch (subType) {
      case TrackListEventType.ADD_TRACK:
        this._state.textTracks = addTrack(this._state.textTracks, track);
        break;
      case TrackListEventType.REMOVE_TRACK:
        this._state.textTracks = removeTrack(this._state.textTracks, track);
        break;
      case TrackListEventType.CHANGE_TRACK:
        this._state.textTracks = removeTrack(this._state.textTracks, track);
        this._state.textTracks = addTrack(this._state.textTracks, track);
        break;
    }
  };

  private onMediaTrack = (event: MediaTrackEvent) => {
    const { subType, trackType, trackUid } = event;
    const tracks = trackType === MediaTrackType.VIDEO ? this._state.videoTracks : this._state.audioTracks;
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
          this._state.audioTracks = addTrack(this._state.audioTracks, track);
        } else {
          this._state.videoTracks = addTrack(this._state.videoTracks, track);
        }
        break;
      case TrackListEventType.REMOVE_TRACK:
        if (isAudio) {
          this._state.audioTracks = removeTrack(this._state.audioTracks, track);
        } else {
          this._state.videoTracks = removeTrack(this._state.videoTracks, track);
        }
        break;
      case TrackListEventType.CHANGE_TRACK:
        if (isAudio) {
          this._state.audioTracks = removeTrack(this._state.audioTracks, track);
          this._state.audioTracks = addTrack(this._state.audioTracks, track);
        } else {
          this._state.videoTracks = removeTrack(this._state.videoTracks, track);
          this._state.videoTracks = addTrack(this._state.videoTracks, track);
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
    this._state.autoplay = autoplay;
    NativeModules.PlayerModule.setPaused(this._view.nativeHandle, !autoplay);
  }

  get autoplay(): boolean {
    return this._state.autoplay;
  }

  set preload(type: PreloadType) {
    this._state.preload = type;
    NativeModules.PlayerModule.setPreload(this._view.nativeHandle, type);
  }

  get preload(): PreloadType {
    return this._state.preload;
  }

  get seekable() {
    return this._state.seekable;
  }

  private seekableEnd(): number {
    const ranges = this.seekable;
    return ranges.length === 0 ? 0 : ranges[ranges.length - 1].end;
  }

  get buffered() {
    return this._state.buffered;
  }

  get cast(): CastAPI {
    return this._castAdapter;
  }

  get currentTime(): number {
    return this._state.currentTime;
  }

  set currentTime(currentTime: number) {
    if (isNaN(currentTime)) {
      return;
    }

    // Sanitise currentTime
    let seekTime = currentTime;
    if (currentTime === Infinity) {
      seekTime = this.seekableEnd();
    }

    this._state.currentTime = seekTime;
    NativeModules.PlayerModule.setCurrentTime(this._view.nativeHandle, seekTime);
  }

  get duration(): number {
    return this._state.duration;
  }

  get pipConfiguration(): PiPConfiguration {
    return this._state.pipConfig;
  }

  set pipConfiguration(pipConfiguration: PiPConfiguration) {
    this._state.pipConfig = pipConfiguration;
    NativeModules.PlayerModule.setPipConfig(this._view.nativeHandle, pipConfiguration);
  }

  get backgroundAudioConfiguration(): BackgroundAudioConfiguration {
    return this._state.backgroundAudioConfig;
  }

  set backgroundAudioConfiguration(backgroundAudioConfiguration: BackgroundAudioConfiguration) {
    this._state.backgroundAudioConfig = backgroundAudioConfiguration;
    NativeModules.PlayerModule.setBackgroundAudioConfig(this._view.nativeHandle, backgroundAudioConfiguration);
  }

  get presentationMode(): PresentationMode {
    return this._state.presentationMode;
  }

  set presentationMode(presentationMode: PresentationMode) {
    this._state.presentationMode = presentationMode;
    NativeModules.PlayerModule.setPresentationMode(this._view.nativeHandle, presentationMode);
  }

  get muted(): boolean {
    return this._state.muted;
  }

  set muted(muted: boolean) {
    this._state.muted = muted;
    NativeModules.PlayerModule.setMuted(this._view.nativeHandle, muted);
  }

  get seeking(): boolean {
    return this._state.seeking;
  }

  get paused(): boolean {
    return this._state.paused;
  }

  get playbackRate(): number {
    return this._state.playbackRate;
  }

  set playbackRate(playbackRate: number) {
    this._state.playbackRate = playbackRate;
    NativeModules.PlayerModule.setPlaybackRate(this._view.nativeHandle, playbackRate);
  }

  get audioTracks(): MediaTrack[] {
    return this._state.audioTracks;
  }

  get selectedAudioTrack(): number | undefined {
    return this._state.selectedAudioTrack;
  }

  set selectedAudioTrack(trackUid: number | undefined) {
    this._state.selectedAudioTrack = trackUid;
    NativeModules.PlayerModule.setSelectedAudioTrack(this._view.nativeHandle, trackUid || -1);
  }

  get videoTracks(): MediaTrack[] {
    return this._state.videoTracks;
  }

  get selectedVideoTrack(): number | undefined {
    return this._state.selectedVideoTrack;
  }

  set selectedVideoTrack(trackUid: number | undefined) {
    this._state.selectedVideoTrack = trackUid;
    this._state.targetVideoQuality = undefined;
    NativeModules.PlayerModule.setSelectedVideoTrack(this._view.nativeHandle, trackUid || -1);
  }

  get textTracks(): TextTrack[] {
    return this._state.textTracks;
  }

  get selectedTextTrack(): number | undefined {
    return this._state.selectedTextTrack;
  }

  set selectedTextTrack(trackUid: number | undefined) {
    this._state.selectedTextTrack = trackUid;
    this.textTracks.forEach((track) => {
      if (track.uid == trackUid) {
        track.mode = TextTrackMode.showing;
      } else if (track.mode === TextTrackMode.showing) {
        track.mode = TextTrackMode.disabled;
      }
    });
    NativeModules.PlayerModule.setSelectedTextTrack(this._view.nativeHandle, trackUid || -1);
  }

  get textTrackStyle(): TextTrackStyle {
    return this._textTrackStyleAdapter;
  }

  get source(): SourceDescription | undefined {
    return this._state.source;
  }

  set source(source: SourceDescription | undefined) {
    // This is to correctly reset autoplay during a source change.
    this.pause();
    this._state.source = source;
    NativeModules.PlayerModule.setSource(this._view.nativeHandle, source);
    // Reset state for play-out of new source
    Object.assign(this._state, {
      playbackRate: 1,
      seeking: false,
      audioTracks: [],
      videoTracks: [],
      textTracks: [],
      seekable: [],
      buffered: [],
      selectedTextTrack: undefined,
      selectedVideoTrack: undefined,
      selectedAudioTrack: undefined,
      targetVideoQuality: undefined,
    });
  }

  get targetVideoQuality(): number | number[] | undefined {
    return this._state.targetVideoQuality;
  }

  set targetVideoQuality(target: number | number[] | undefined) {
    // Always pass an array for targetVideoQuality.
    this._state.targetVideoQuality = !target ? [] : Array.isArray(target) ? target : [target];

    // Update local state
    const track = findMediaTrackByUid(this._state.videoTracks, this.selectedVideoTrack);
    if (track) {
      Object.assign(track, { ...track, targetQuality: this._state.targetVideoQuality });
    }
    NativeModules.PlayerModule.setTargetVideoQuality(this._view.nativeHandle, this._state.targetVideoQuality);
  }

  get volume(): number {
    return this._state.volume;
  }

  set volume(volume: number) {
    this._state.volume = volume;
    NativeModules.PlayerModule.setVolume(this._view.nativeHandle, volume);
  }

  pause(): void {
    this._state.paused = true;
    NativeModules.PlayerModule.setPaused(this._view.nativeHandle, true);
  }

  play(): void {
    this._state.paused = false;
    NativeModules.PlayerModule.setPaused(this._view.nativeHandle, false);
  }

  get nativeHandle(): NativeHandleType {
    return this._view.nativeHandle;
  }

  applyNativeState(state: NativePlayerState) {
    Object.assign(this._state, state);
  }
}
