import { DefaultEventDispatcher } from './event/DefaultEventDispatcher';
import type {
  AdsAPI,
  CastAPI,
  MediaTrack,
  NativeHandleType,
  PlayerEventMap,
  PreloadType,
  PresentationMode,
  TextTrack,
  TextTrackStyle,
  THEOplayer,
} from 'react-native-theoplayer';
import { THEOplayerWebAdsAdapter } from './ads/THEOplayerWebAdsAdapter';
import { THEOplayerWebCastAdapter } from './cast/THEOplayerWebCastAdapter';
import type * as THEOplayerWeb from 'theoplayer';
import type { MediaTrack as NativeMediaTrack, TextTrack as NativeTextTrack } from 'theoplayer';
import { findNativeQualitiesByUid, fromNativeMediaTrackList, fromNativeTextTrackList } from './web/TrackUtils';
import type { ABRConfiguration, SourceDescription } from 'src/api/barrel';
import { WebEventForwarder } from './WebEventForwarder';
import type { PiPConfiguration } from 'src/api/pip/PiPConfiguration';
import type { BackgroundAudioConfiguration } from 'src/api/backgroundAudio/BackgroundAudioConfiguration';
import { WebPresentationModeManager } from './web/WebPresentationModeManager';

const defaultBackgroundAudioConfiguration: BackgroundAudioConfiguration = {
  enabled: false,
};

const defaultPipConfiguration: PiPConfiguration = {
  startsAutomatically: false,
};

export class THEOplayerWebAdapter extends DefaultEventDispatcher<PlayerEventMap> implements THEOplayer {
  private readonly _player: THEOplayerWeb.ChromelessPlayer;
  private readonly _adsAdapter: THEOplayerWebAdsAdapter;
  private readonly _castAdapter: THEOplayerWebCastAdapter;
  private readonly _eventForwarder: WebEventForwarder;
  private _targetVideoQuality: number | number[] | undefined = undefined;
  private _presentationModeManager: WebPresentationModeManager;
  private _backgroundAudioConfiguration: BackgroundAudioConfiguration = defaultBackgroundAudioConfiguration;
  private _pipConfiguration: PiPConfiguration = defaultPipConfiguration;

  constructor(player: THEOplayerWeb.ChromelessPlayer) {
    super();
    this._player = player;
    this._adsAdapter = new THEOplayerWebAdsAdapter(this._player);
    this._castAdapter = new THEOplayerWebCastAdapter(this._player);
    this._eventForwarder = new WebEventForwarder(this._player, this);
    this._presentationModeManager = new WebPresentationModeManager(this._player, this);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  get abr(): ABRConfiguration | undefined {
    return this._player.abr;
  }

  get source(): SourceDescription | undefined {
    return this._player.source as SourceDescription;
  }

  set source(source: SourceDescription | undefined) {
    this._targetVideoQuality = undefined;
    this._player.source = source;
  }

  play(): void {
    this._player.play();
  }

  pause(): void {
    this._player.pause();
  }

  get paused(): boolean {
    return this._player.paused;
  }

  get autoplay(): boolean {
    return this._player.autoplay;
  }

  set autoplay(autoplay: boolean) {
    this._player.autoplay = autoplay;
  }

  set preload(type: PreloadType) {
    this._player.preload = type;
  }

  get preload(): PreloadType {
    return this._player.preload;
  }

  get seekable() {
    const nativeRange = this._player.seekable;
    return [...Array(nativeRange.length)].map((_, index) => ({ start: 1e3 * nativeRange.start(index), end: 1e3 * nativeRange.end(index) }));
  }

  get buffered() {
    const nativeRange = this._player.buffered;
    return [...Array(nativeRange.length)].map((_, index) => ({ start: 1e3 * nativeRange.start(index), end: 1e3 * nativeRange.end(index) }));
  }

  get playbackRate(): number {
    return this._player.playbackRate;
  }

  set playbackRate(playbackRate: number) {
    this._player.playbackRate = playbackRate;
  }

  get pipConfiguration(): PiPConfiguration {
    return this._pipConfiguration;
  }

  set pipConfiguration(config: PiPConfiguration) {
    this._pipConfiguration = config;
  }

  get backgroundAudioConfiguration(): BackgroundAudioConfiguration {
    return this._backgroundAudioConfiguration;
  }

  set backgroundAudioConfiguration(config: BackgroundAudioConfiguration) {
    this._backgroundAudioConfiguration = config;
  }

  get volume(): number {
    return this._player.volume;
  }

  set volume(volume: number) {
    this._player.volume = volume;
  }

  get muted(): boolean {
    return this._player.muted;
  }

  set muted(muted: boolean) {
    this._player.muted = muted;
  }

  get seeking(): boolean {
    return this._player.seeking;
  }

  get presentationMode(): PresentationMode {
    return this._presentationModeManager.presentationMode;
  }

  set presentationMode(presentationMode: PresentationMode) {
    this._presentationModeManager.presentationMode = presentationMode;
  }

  get audioTracks(): MediaTrack[] {
    return fromNativeMediaTrackList(this._player.audioTracks);
  }

  get videoTracks(): MediaTrack[] {
    return fromNativeMediaTrackList(this._player.videoTracks);
  }

  get textTracks(): TextTrack[] {
    return fromNativeTextTrackList(this._player.textTracks);
  }

  get selectedTextTrack(): number | undefined {
    return this._player.textTracks.find((textTrack: NativeTextTrack) => {
      return textTrack.mode === 'showing';
    })?.uid;
  }

  set selectedTextTrack(selectedTextTrack: number | undefined) {
    this._player.textTracks.forEach((textTrack: NativeTextTrack) => {
      textTrack.mode = textTrack.uid === selectedTextTrack ? 'showing' : 'disabled';
    });
  }

  get textTrackStyle(): TextTrackStyle {
    return this._player.textTrackStyle as TextTrackStyle;
  }

  get selectedVideoTrack(): number | undefined {
    return this._player.videoTracks.find((videoTrack: NativeMediaTrack) => videoTrack.enabled)?.uid;
  }

  set selectedVideoTrack(selectedVideoTrack: number | undefined) {
    this._targetVideoQuality = undefined;
    this._player.videoTracks.forEach((videoTrack: NativeMediaTrack) => {
      videoTrack.enabled = videoTrack.uid === selectedVideoTrack;
    });
  }

  get selectedAudioTrack(): number | undefined {
    return this._player.audioTracks.find((audioTrack: NativeMediaTrack) => {
      return audioTrack.enabled;
    })?.uid;
  }

  set selectedAudioTrack(selectedAudioTrack: number | undefined) {
    this._player.audioTracks.forEach((audioTrack: NativeMediaTrack) => {
      audioTrack.enabled = audioTrack.uid === selectedAudioTrack;
    });
  }

  get targetVideoQuality(): number | number[] | undefined {
    return this._targetVideoQuality;
  }

  set targetVideoQuality(targetVideoQuality: number | number[] | undefined) {
    const enabledVideoTrack = this._player.videoTracks.find((videoTrack: NativeMediaTrack) => videoTrack.enabled);
    if (enabledVideoTrack) {
      enabledVideoTrack.targetQuality = findNativeQualitiesByUid(enabledVideoTrack, targetVideoQuality);
    }
    this._targetVideoQuality = targetVideoQuality;
  }

  get currentTime(): number {
    return 1e3 * this._player.currentTime;
  }

  set currentTime(currentTime: number) {
    if (isNaN(currentTime)) {
      return;
    }
    if (this._player) {
      this._player.currentTime = currentTime / 1e3;
    }
  }

  get duration(): number {
    return this._player.duration * 1e3;
  }

  public get ads(): AdsAPI {
    return this._adsAdapter;
  }

  public get cast(): CastAPI {
    return this._castAdapter;
  }

  destroy(): void {
    this._eventForwarder.unload();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }

  get nativeHandle(): NativeHandleType {
    return this._player;
  }

  private readonly onVisibilityChange = () => {
    if (document.visibilityState !== 'visible') {
      // Apply background configuration
      if (!this.backgroundAudioConfiguration.enabled) {
        this._player.pause();
      }
    }
  };
}
