import { DefaultEventDispatcher } from '../event/DefaultEventDispatcher';
import type {
  ABRConfiguration,
  AdsAPI,
  CastAPI,
  PlayerEventMap,
  SourceDescription,
  THEOplayerInternal,
  THEOplayerView,
} from 'react-native-theoplayer';
import { THEOplayerNativeAdsAPI } from '../ads/THEOplayerNativeAdsAPI';
import { THEOplayerNativeCastAPI } from '../cast/THEOplayerNativeCastApi';

export class THEOplayerViewExposed extends DefaultEventDispatcher<PlayerEventMap> implements THEOplayerInternal {
  private readonly _view: THEOplayerView;
  private readonly _adsApi: THEOplayerNativeAdsAPI;
  private readonly _castApi: THEOplayerNativeCastAPI;

  private _autoplay: boolean;

  constructor(view: THEOplayerView) {
    super();
    this._view = view;
    this._adsApi = new THEOplayerNativeAdsAPI(this._view);
    this._castApi = new THEOplayerNativeCastAPI(this._view);
    this._autoplay = false;
  }

  get abr(): ABRConfiguration | undefined {
    return this._view.state.abrConfig;
  }

  get ads(): AdsAPI {
    return this._adsApi;
  }

  set autoplay(autoplay: boolean) {
    this._autoplay = autoplay;
  }

  get autoplay(): boolean {
    return this._autoplay;
  }

  get cast(): CastAPI {
    return this._castApi;
  }

  get currentTime(): number {
    return 0;
    // return this._view.state.currentTime; // TODO
  }

  set currentTime(currentTime: number) {
    this._view.seek(currentTime);
  }

  get fullscreen(): boolean {
    return this._view.state.fullscreen ?? false;
  }

  set fullscreen(fullscreen: boolean) {
    this._view.setState({ fullscreen });
  }

  get muted(): boolean {
    return this._view.state.muted ?? false;
  }

  set muted(muted: boolean) {
    this._view.setState({ muted });
  }

  get paused(): boolean {
    return this._view.state.paused ?? false;
  }

  get playbackRate(): number {
    return this._view.state.playbackRate ?? 1;
  }

  set playbackRate(playbackRate: number) {
    this._view.setState({ playbackRate });
  }

  get selectedAudioTrack(): number | undefined {
    return this._view.state.selectedAudioTrack;
  }

  set selectedAudioTrack(selectedAudioTrack: number | undefined) {
    this._view.setState({ selectedAudioTrack });
  }

  get selectedTextTrack(): number | undefined {
    return this._view.state.selectedTextTrack;
  }

  set selectedTextTrack(selectedTextTrack: number | undefined) {
    this._view.setState({ selectedTextTrack });
  }

  get selectedVideoTrack(): number | undefined {
    return this._view.state.selectedVideoTrack;
  }

  set selectedVideoTrack(selectedVideoTrack: number | undefined) {
    this._view.setState({ selectedVideoTrack });
  }

  get source(): SourceDescription | undefined {
    return this._view.state.source;
  }

  set source(source: SourceDescription | undefined) {
    this._view.setState({ source });
  }

  get targetVideoQuality(): number | number[] | undefined {
    return this._view.state.targetVideoQuality;
  }

  set targetVideoQuality(target: number | number[] | undefined) {
    this._view.setState({ targetVideoQuality: target });
  }

  get volume(): number {
    return this._view.state.volume ?? 1; // TODO
  }

  set volume(volume: number) {
    this._view.setState({ volume });
  }

  pause(): void {
    this._view.setState({ paused: true });
  }

  play(): void {
    this._view.setState({ paused: false });
  }
}
