import { DefaultEventDispatcher } from './event/DefaultEventDispatcher';
import {
  AdsAPI,
  AspectRatio,
  CastAPI,
  CmcdConfiguration,
  CmcdTransmissionMode,
  EventBroadcastAPI,
  MediaTrack,
  NativeHandleType,
  PlayerConfiguration,
  PlayerEventMap,
  PlayerEventType,
  PlayerVersion,
  PreloadType,
  PresentationMode,
  TextTrack,
  TextTrackStyle,
  TheoAdsAPI,
  THEOplayer,
} from 'react-native-theoplayer';
import { THEOplayerWebAdsAdapter } from './ads/THEOplayerWebAdsAdapter';
import { THEOplayerWebCastAdapter } from './cast/THEOplayerWebCastAdapter';
import type { MediaTrack as NativeMediaTrack, TextTrack as NativeTextTrack } from 'theoplayer';
import { ChromelessPlayer as NativeChromelessPlayer, SourceDescription as NativeSourceDescription, version as nativeVersion } from 'theoplayer';
import { findNativeQualitiesByUid, fromNativeMediaTrackList } from './web/TrackUtils';
import type { ABRConfiguration, SourceDescription } from 'src/api/barrel';
import { WebEventForwarder } from './WebEventForwarder';
import type { PiPConfiguration } from 'src/api/pip/PiPConfiguration';
import type { BackgroundAudioConfiguration } from 'src/api/backgroundAudio/BackgroundAudioConfiguration';
import { WebPresentationModeManager } from './web/WebPresentationModeManager';
import { WebMediaSession } from './web/WebMediaSession';
import { BaseEvent } from './event/BaseEvent';
import { EventBroadcastAdapter } from './broadcast/EventBroadcastAdapter';
import { TextTrackState } from './NativePlayerState';
import { DefaultTextTrackState } from './DefaultTextTrackState';
import { THEOAdsWebAdapter } from './theoads/THEOAdsWebAdapter';
import { CMCDConnector, Configuration, createCMCDConnector, TransmissionMode } from '@theoplayer/cmcd-connector-web';

const defaultBackgroundAudioConfiguration: BackgroundAudioConfiguration = {
  enabled: false,
};

const defaultPipConfiguration: PiPConfiguration = {
  startsAutomatically: false,
};

export class THEOplayerWebAdapter extends DefaultEventDispatcher<PlayerEventMap> implements THEOplayer {
  private readonly _adsAdapter: THEOplayerWebAdsAdapter;
  private readonly _castAdapter: THEOplayerWebCastAdapter;
  private readonly _theoAdsAdapter: THEOAdsWebAdapter;
  private readonly _textTrackState: TextTrackState;
  private readonly _presentationModeManager: WebPresentationModeManager;
  private _player: NativeChromelessPlayer | undefined;
  private _eventForwarder: WebEventForwarder | undefined;
  private _mediaSession: WebMediaSession | undefined = undefined;
  private _targetVideoQuality: number | number[] | undefined = undefined;
  private _backgroundAudioConfiguration: BackgroundAudioConfiguration = defaultBackgroundAudioConfiguration;
  private _pipConfiguration: PiPConfiguration = defaultPipConfiguration;
  private _externalEventRouter: EventBroadcastAPI | undefined = undefined;
  private _cmcdConnector: CMCDConnector | undefined = undefined;

  constructor(player: NativeChromelessPlayer, config?: PlayerConfiguration) {
    super();
    this._player = player;
    this._adsAdapter = new THEOplayerWebAdsAdapter(this._player);
    this._castAdapter = new THEOplayerWebCastAdapter(this._player);
    this._theoAdsAdapter = new THEOAdsWebAdapter(this._player);
    this._textTrackState = new DefaultTextTrackState(this);
    this._eventForwarder = new WebEventForwarder(this._player, this);
    this._presentationModeManager = new WebPresentationModeManager(this._player, this);
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    // Optionally create a media session connector
    if (config?.mediaControl?.mediaSessionEnabled !== false) {
      this._mediaSession = new WebMediaSession(this, player, config?.mediaControl);
    }
  }

  get abr(): ABRConfiguration | undefined {
    return this._player?.abr as ABRConfiguration | undefined;
  }

  get source(): SourceDescription | undefined {
    return this._player?.source as SourceDescription;
  }

  set source(source: SourceDescription | undefined) {
    this._targetVideoQuality = undefined;
    if (this._player) {
      this._player.source = source as NativeSourceDescription;
      if (source?.cmcd && this._cmcdConnector === undefined) {
        this._cmcdConnector = createCMCDConnector(this._player);
      }
      this._cmcdConnector?.reconfigure(this.toWebCmcdConfiguration(source?.cmcd));
    }
  }

  private toWebCmcdConfiguration(cmcdConfiguration?: CmcdConfiguration): Configuration | undefined {
    if (!cmcdConfiguration) {
      return undefined;
    }

    let transmissionMode = TransmissionMode.QUERY_ARGUMENT;
    switch (cmcdConfiguration.transmissionMode) {
      case CmcdTransmissionMode.HTTP_HEADER:
        transmissionMode = TransmissionMode.HTTP_HEADER;
        break;
      case CmcdTransmissionMode.JSON_OBJECT:
        transmissionMode = TransmissionMode.JSON_OBJECT;
        break;
      case CmcdTransmissionMode.QUERY_ARGUMENT:
      case CmcdTransmissionMode.SDK_DEFAULT:
      default:
        transmissionMode = TransmissionMode.QUERY_ARGUMENT;
    }
    return {
      ...cmcdConfiguration,
      transmissionMode: transmissionMode,
    };
  }

  play(): void {
    this._player?.play();
  }

  pause(): void {
    this._player?.pause();
  }

  get paused(): boolean {
    return this._player ? this._player.paused : true;
  }

  get autoplay(): boolean {
    return this._player ? this._player.autoplay : false;
  }

  set autoplay(autoplay: boolean) {
    if (this._player) {
      this._player.autoplay = autoplay;
    }
  }

  set preload(type: PreloadType) {
    if (this._player) {
      this._player.preload = type;
    }
  }

  get preload(): PreloadType {
    return this._player?.preload || 'none';
  }

  get seekable() {
    if (!this._player) {
      return [];
    }
    const nativeRange = this._player.seekable;
    return [...Array(nativeRange.length)].map((_, index) => ({ start: 1e3 * nativeRange.start(index), end: 1e3 * nativeRange.end(index) }));
  }

  get buffered() {
    if (!this._player) {
      return [];
    }
    const nativeRange = this._player.buffered;
    return [...Array(nativeRange.length)].map((_, index) => ({ start: 1e3 * nativeRange.start(index), end: 1e3 * nativeRange.end(index) }));
  }

  get playbackRate(): number {
    return this._player ? this._player.playbackRate : 1;
  }

  set playbackRate(playbackRate: number) {
    if (this._player) {
      this._player.playbackRate = playbackRate;
    }
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

    // Notify media session
    this._mediaSession?.updateMediaSession();
  }

  get volume(): number {
    return this._player ? this._player.volume : 1;
  }

  set volume(volume: number) {
    if (this._player) {
      this._player.volume = volume;
    }
  }

  get muted(): boolean {
    return this._player ? this._player.muted : false;
  }

  set muted(muted: boolean) {
    if (this._player) {
      this._player.muted = muted;
    }
  }

  get seeking(): boolean {
    return this._player ? this._player.seeking : false;
  }

  get presentationMode(): PresentationMode {
    return this._presentationModeManager.presentationMode;
  }

  set presentationMode(presentationMode: PresentationMode) {
    this._presentationModeManager.presentationMode = presentationMode;
  }

  get audioTracks(): MediaTrack[] {
    return this._player ? fromNativeMediaTrackList(this._player.audioTracks) : [];
  }

  get videoTracks(): MediaTrack[] {
    return this._player ? fromNativeMediaTrackList(this._player.videoTracks) : [];
  }

  get textTracks(): TextTrack[] {
    return this._textTrackState.textTracks;
  }

  get selectedTextTrack(): number | undefined {
    return this._player ? this._textTrackState.selectedTextTrack : undefined;
  }

  set selectedTextTrack(trackUid: number | undefined) {
    if (this._player) {
      this._textTrackState.selectedTextTrack = trackUid;

      // Apply native selection
      this._player.textTracks.forEach((textTrack: NativeTextTrack) => {
        if (textTrack.uid === trackUid) {
          textTrack.mode = 'showing';
        } else if (textTrack.mode === 'showing') {
          textTrack.mode = 'disabled';
        }
      });
    }
  }

  get textTrackStyle(): TextTrackStyle {
    return this._player?.textTrackStyle as unknown as TextTrackStyle;
  }

  get selectedVideoTrack(): number | undefined {
    if (this._player) {
      return this._player.videoTracks.find((videoTrack: NativeMediaTrack) => videoTrack.enabled)?.uid;
    }
    return undefined;
  }

  set selectedVideoTrack(selectedVideoTrack: number | undefined) {
    if (this._player) {
      this._targetVideoQuality = undefined;
      this._player.videoTracks.forEach((videoTrack: NativeMediaTrack) => {
        videoTrack.enabled = videoTrack.uid === selectedVideoTrack;
      });
    }
  }

  get selectedAudioTrack(): number | undefined {
    if (this._player) {
      return this._player.audioTracks.find((audioTrack: NativeMediaTrack) => {
        return audioTrack.enabled;
      })?.uid;
    }
    return undefined;
  }

  set selectedAudioTrack(selectedAudioTrack: number | undefined) {
    if (this._player) {
      this._player.audioTracks.forEach((audioTrack: NativeMediaTrack) => {
        audioTrack.enabled = audioTrack.uid === selectedAudioTrack;
      });
    }
  }

  get targetVideoQuality(): number | number[] | undefined {
    if (this._player) {
      return this._targetVideoQuality;
    }
    return undefined;
  }

  set targetVideoQuality(targetVideoQuality: number | number[] | undefined) {
    if (this._player) {
      const enabledVideoTrack = this._player.videoTracks.find((videoTrack: NativeMediaTrack) => videoTrack.enabled);
      if (enabledVideoTrack) {
        enabledVideoTrack.targetQuality = findNativeQualitiesByUid(enabledVideoTrack, targetVideoQuality);
      }
      this._targetVideoQuality = targetVideoQuality;
    }
  }

  get currentTime(): number {
    return this._player ? 1e3 * this._player.currentTime : NaN;
  }

  set currentTime(currentTime: number) {
    if (isNaN(currentTime)) {
      return;
    }
    if (this._player) {
      this._player.currentTime = currentTime / 1e3;
    }
  }

  get aspectRatio(): AspectRatio {
    return AspectRatio.FIT;
  }

  set aspectRatio(_ratio: AspectRatio) {
    // unused
  }

  get keepScreenOn(): boolean {
    return false;
  }

  set keepScreenOn(_screenOn: boolean) {
    // unused
  }

  get duration(): number {
    return this._player ? this._player.duration * 1e3 : NaN;
  }

  public get ads(): AdsAPI {
    return this._adsAdapter;
  }

  public get theoads(): TheoAdsAPI {
    return this._theoAdsAdapter;
  }

  public get cast(): CastAPI {
    return this._castAdapter;
  }

  public get version(): PlayerVersion {
    return {
      version: nativeVersion,
      playerSuiteVersion: '', // deprecated
    };
  }

  destroy(): void {
    this.dispatchEvent(new BaseEvent(PlayerEventType.DESTROY));
    this._eventForwarder?.unload();
    this._mediaSession?.destroy();
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this._eventForwarder = undefined;
    this._mediaSession = undefined;
    this._cmcdConnector?.destroy();
    this._cmcdConnector = undefined;
    this._player?.destroy();
    this._player = undefined;
  }

  private readonly onVisibilityChange = () => {
    if (!this._player) {
      return;
    }
    if (document.visibilityState !== 'visible') {
      // Apply background configuration: by default, pause when going to background, unless in pip
      if (this.presentationMode !== PresentationMode.pip && !this.backgroundAudioConfiguration.enabled) {
        this._player.pause();
      }
    }
    // Apply media session controls
    this._mediaSession?.updateMediaSession();
  };

  get nativeHandle(): NativeHandleType {
    return this._player;
  }

  get broadcast(): EventBroadcastAPI {
    return this._externalEventRouter ?? (this._externalEventRouter = new EventBroadcastAdapter(this));
  }

  get width(): number | undefined {
    return this._player?.videoWidth;
  }

  get height(): number | undefined {
    return this._player?.videoHeight;
  }
}
