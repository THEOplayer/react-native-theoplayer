import type * as THEOplayer from 'theoplayer';
import type {
  AddTrackEvent,
  DurationChangeEvent as NativeDurationChangeEvent,
  ErrorEvent as NativeErrorEvent,
  Event as NativeEvent,
  MediaTrack as NativeMediaTrack,
  PresentationModeChangeEvent,
  RateChangeEvent as NativeRateChangeEvent,
  ReadyStateChangeEvent as NativeReadyStateChangeEvent,
  RemoveTrackEvent,
  TextTrack as NativeTextTrack,
  TextTrackCue as NativeTextTrackCue,
  TimeUpdateEvent as NativeTimeUpdateEvent,
  TrackChangeEvent,
  VolumeChangeEvent as NativeVolumeChangeEvent,
} from 'theoplayer';
import type { AdEvent, MediaTrack, TextTrack, TimeRange } from 'react-native-theoplayer';
import { AdEventType, MediaTrackEventType, MediaTrackType, PlayerEventType, TextTrackEventType, TrackListEventType } from 'react-native-theoplayer';
import type { THEOplayerWebAdapter } from './THEOplayerWebAdapter';
import { BaseEvent } from './event/BaseEvent';
import {
  DefaultAdEvent,
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
  DefaultTimeupdateEvent,
  DefaultVolumeChangeEvent,
} from './event/PlayerEvents';
import { fromNativeCue, fromNativeMediaTrack, fromNativeTextTrack } from './web/TrackUtils';

export class WebEventForwarder {
  private readonly _player: THEOplayer.ChromelessPlayer;
  private readonly _facade: THEOplayerWebAdapter;

  constructor(player: THEOplayer.ChromelessPlayer, facade: THEOplayerWebAdapter) {
    this._player = player;
    this._facade = facade;
    this.addEventListeners();
  }

  private addEventListeners() {
    this._player.addEventListener('sourcechange', this.onSourceChange);
    this._player.addEventListener('loadstart', this.onLoadStart);
    this._player.addEventListener('loadeddata', this.onLoadedData);
    this._player.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this._player.addEventListener('error', this.onError);
    this._player.addEventListener('progress', this.onProgress);
    this._player.addEventListener('play', this.onPlay);
    this._player.addEventListener('canplay', this.onCanPlay);
    this._player.addEventListener('playing', this.onPlaying);
    this._player.addEventListener('pause', this.onPause);
    this._player.addEventListener('seeking', this.onSeeking);
    this._player.addEventListener('seeked', this.onSeeked);
    this._player.addEventListener('ended', this.onEnded);
    this._player.addEventListener('waiting', this.onWaiting);
    this._player.addEventListener('readystatechange', this.onReadyStateChanged);
    this._player.addEventListener('timeupdate', this.onTimeUpdate);
    this._player.addEventListener('durationchange', this.onDurationChange);
    this._player.addEventListener('ratechange', this.onPlaybackRateChange);
    this._player.addEventListener('segmentnotfound', this.onSegmentNotFound);
    this._player.addEventListener('volumechange', this.onVolumeChangeEvent);
    this._player.presentation.addEventListener('presentationmodechange', this.onPresentationModeChange);

    this._player.textTracks.addEventListener('addtrack', this.onAddTextTrack);
    this._player.textTracks.addEventListener('removetrack', this.onRemoveTextTrack);
    this._player.textTracks.addEventListener('change', this.onChangeTextTrack);

    this._player.audioTracks.addEventListener('addtrack', this.onAddAudioTrack);
    this._player.audioTracks.addEventListener('removetrack', this.onRemoveAudioTrack);
    this._player.audioTracks.addEventListener('change', this.onChangeAudioTrack);

    this._player.videoTracks.addEventListener('addtrack', this.onAddVideoTrack);
    this._player.videoTracks.addEventListener('removetrack', this.onRemoveVideoTrack);
    this._player.videoTracks.addEventListener('change', this.onChangeVideoTrack);

    this._player.ads?.addEventListener(FORWARDED_AD_EVENTS, this.onAdEvent);
  }

  unload(): void {
    this.removeEventListeners();
  }

  private removeEventListeners() {
    this._player.removeEventListener('sourcechange', this.onSourceChange);
    this._player.removeEventListener('loadstart', this.onLoadStart);
    this._player.removeEventListener('loadeddata', this.onLoadedData);
    this._player.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this._player.removeEventListener('error', this.onError);
    this._player.removeEventListener('progress', this.onProgress);
    this._player.removeEventListener('canplay', this.onCanPlay);
    this._player.removeEventListener('play', this.onPlay);
    this._player.removeEventListener('playing', this.onPlaying);
    this._player.removeEventListener('pause', this.onPause);
    this._player.removeEventListener('seeking', this.onSeeking);
    this._player.removeEventListener('seeked', this.onSeeked);
    this._player.removeEventListener('ended', this.onEnded);
    this._player.removeEventListener('waiting', this.onWaiting);
    this._player.removeEventListener('readystatechange', this.onReadyStateChanged);
    this._player.removeEventListener('timeupdate', this.onTimeUpdate);
    this._player.removeEventListener('durationchange', this.onDurationChange);
    this._player.removeEventListener('ratechange', this.onPlaybackRateChange);
    this._player.removeEventListener('segmentnotfound', this.onSegmentNotFound);
    this._player.removeEventListener('volumechange', this.onVolumeChangeEvent);
    this._player.presentation.removeEventListener('presentationmodechange', this.onPresentationModeChange);

    this._player.textTracks.removeEventListener('addtrack', this.onAddTextTrack);
    this._player.textTracks.removeEventListener('removetrack', this.onRemoveTextTrack);
    this._player.textTracks.removeEventListener('change', this.onChangeTextTrack);

    this._player.audioTracks.removeEventListener('addtrack', this.onAddAudioTrack);
    this._player.audioTracks.removeEventListener('removetrack', this.onRemoveAudioTrack);
    this._player.audioTracks.removeEventListener('change', this.onChangeAudioTrack);

    this._player.videoTracks.removeEventListener('addtrack', this.onAddVideoTrack);
    this._player.videoTracks.removeEventListener('removetrack', this.onRemoveVideoTrack);
    this._player.videoTracks.removeEventListener('change', this.onChangeVideoTrack);

    this._player.ads?.removeEventListener(FORWARDED_AD_EVENTS, this.onAdEvent);
  }

  private readonly onSourceChange = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.SOURCE_CHANGE));
  };

  private readonly onLoadStart = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.LOAD_START));
  };

  private readonly onLoadedData = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.LOADED_DATA));
  };

  private readonly onLoadedMetadata = () => {
    this._facade.dispatchEvent(
      new DefaultLoadedMetadataEvent(
        this._player.textTracks.map((textTrack: NativeTextTrack) => fromNativeTextTrack(textTrack)),
        this._player.audioTracks.map((audioTrack: NativeMediaTrack) => fromNativeMediaTrack(audioTrack)),
        this._player.videoTracks.map((videoTrack: NativeMediaTrack) => fromNativeMediaTrack(videoTrack)),
        1e3 * this._player.duration,
        this._player.textTracks.find((track: NativeTextTrack) => track.mode === 'showing')?.uid,
        this._player.videoTracks.find((track: NativeMediaTrack) => track.enabled)?.uid,
        this._player.audioTracks.find((track: NativeMediaTrack) => track.enabled)?.uid,
      ),
    );
  };

  private readonly onError = (event: NativeErrorEvent) => {
    this._facade.dispatchEvent(
      new DefaultErrorEvent({
        errorCode: event.errorObject.code.toString(),
        errorMessage: event.errorObject.message,
      }),
    );
  };

  private readonly onProgress = () => {
    this._facade.dispatchEvent(new DefaultProgressEvent(fromTimeRanges(this._player.seekable), fromTimeRanges(this._player.buffered)));
  };

  private readonly onCanPlay = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.CANPLAY));
  };

  private readonly onPlay = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.PLAY));
  };

  private readonly onPlaying = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.PLAYING));
  };

  private readonly onPause = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.PAUSE));
  };

  private readonly onSeeking = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.SEEKING));
  };

  private readonly onSeeked = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.SEEKED));
  };

  private readonly onEnded = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.ENDED));
  };

  private readonly onWaiting = () => {
    this._facade.dispatchEvent(new BaseEvent(PlayerEventType.WAITING));
  };

  private readonly onReadyStateChanged = (event: NativeReadyStateChangeEvent) => {
    this._facade.dispatchEvent(new DefaultReadyStateChangeEvent(event.readyState));
  };

  private readonly onTimeUpdate = (event: NativeTimeUpdateEvent) => {
    this._facade.dispatchEvent(new DefaultTimeupdateEvent(event.currentTime * 1e3, event.currentProgramDateTime?.getTime()));
  };

  private readonly onDurationChange = (event: NativeDurationChangeEvent) => {
    this._facade.dispatchEvent(new DefaultDurationChangeEvent(event.duration * 1e3));
  };

  private readonly onPlaybackRateChange = (event: NativeRateChangeEvent) => {
    this._facade.dispatchEvent(new DefaultRateChangeEvent(event.playbackRate));
  };

  private readonly onSegmentNotFound = () => {
    this._facade.dispatchEvent(new DefaultSegmentNotFoundEvent(0, 'Segment not found', -1));
  };

  private readonly onVolumeChangeEvent = (event: NativeVolumeChangeEvent) => {
    this._facade.dispatchEvent(new DefaultVolumeChangeEvent(event.volume, this._player.muted));
  };

  private readonly onPresentationModeChange = (event: PresentationModeChangeEvent) => {
    this._facade.dispatchEvent(new DefaultPresentationModeChangeEvent(event.presentationMode, 'inline')); // TODO: move to extended event
  };

  private readonly onAddTextTrack = (event: AddTrackEvent) => {
    const track = event.track as NativeTextTrack;
    track.addEventListener('addcue', this.onAddTextTrackCue(track));
    track.addEventListener('removecue', this.onRemoveTextTrackCue(track));
    track.addEventListener('entercue', this.onEnterTextTrackCue(track));
    track.addEventListener('exitcue', this.onExitTextTrackCue(track));
    this._facade.dispatchEvent(new DefaultTextTrackListEvent(TrackListEventType.ADD_TRACK, track as TextTrack));
  };

  private readonly onRemoveTextTrack = (event: RemoveTrackEvent) => {
    const track = event.track as NativeTextTrack;
    track.removeEventListener('addcue', this.onAddTextTrackCue(track));
    track.removeEventListener('removecue', this.onRemoveTextTrackCue(track));
    track.removeEventListener('entercue', this.onEnterTextTrackCue(track));
    track.removeEventListener('exitcue', this.onExitTextTrackCue(track));
    this._facade.dispatchEvent(new DefaultTextTrackListEvent(TrackListEventType.REMOVE_TRACK, track as NativeTextTrack as TextTrack));
  };

  private readonly onChangeTextTrack = (event: TrackChangeEvent) => {
    this._facade.dispatchEvent(new DefaultTextTrackListEvent(TrackListEventType.CHANGE_TRACK, event.track as NativeTextTrack as TextTrack));
  };

  private readonly onAddAudioTrack = (event: AddTrackEvent) => {
    this.onAddMediaTrack(event, MediaTrackType.AUDIO);
  };

  private readonly onAddVideoTrack = (event: AddTrackEvent) => {
    this.onAddMediaTrack(event, MediaTrackType.VIDEO);
  };

  private readonly onAddMediaTrack = (event: AddTrackEvent, trackType: MediaTrackType) => {
    const track = event.track as NativeMediaTrack;
    track.addEventListener('activequalitychanged', this.onActiveQualityChanged(trackType, track));
    this._facade.dispatchEvent(new DefaultMediaTrackListEvent(TrackListEventType.ADD_TRACK, trackType, track as MediaTrack));
  };

  private readonly onRemoveAudioTrack = (event: RemoveTrackEvent) => {
    this.onRemoveMediaTrack(event, MediaTrackType.AUDIO);
  };

  private readonly onRemoveVideoTrack = (event: RemoveTrackEvent) => {
    this.onRemoveMediaTrack(event, MediaTrackType.VIDEO);
  };

  private readonly onRemoveMediaTrack = (event: RemoveTrackEvent, trackType: MediaTrackType) => {
    const track = event.track as NativeMediaTrack;
    track.removeEventListener('activequalitychanged', this.onActiveQualityChanged(trackType, track));
    this._facade.dispatchEvent(new DefaultMediaTrackListEvent(TrackListEventType.REMOVE_TRACK, trackType, track as MediaTrack));
  };

  private readonly onChangeAudioTrack = (event: TrackChangeEvent) => {
    this.onChangeMediaTrack(event, MediaTrackType.AUDIO);
  };

  private readonly onChangeVideoTrack = (event: TrackChangeEvent) => {
    this.onChangeMediaTrack(event, MediaTrackType.VIDEO);
  };

  private onChangeMediaTrack = (event: TrackChangeEvent, trackType: MediaTrackType) => {
    const track = event.track as NativeMediaTrack;
    this._facade.dispatchEvent(new DefaultMediaTrackListEvent(TrackListEventType.CHANGE_TRACK, trackType, track as MediaTrack));
  };

  private readonly onAdEvent = (event: NativeEvent) => {
    const castedEvent = event as AdEvent;
    this._facade.dispatchEvent(new DefaultAdEvent(event.type as AdEventType, castedEvent.ad));
  };

  private readonly onAddTextTrackCue = (track: NativeTextTrack) => (event: NativeEvent<'addcue'>) => {
    const { cue } = event as unknown as { cue: NativeTextTrackCue };
    if (cue) {
      this._facade.dispatchEvent(new DefaultTextTrackEvent(TextTrackEventType.ADD_CUE, track.uid, fromNativeCue(cue)));
    }
  };

  private readonly onRemoveTextTrackCue = (track: NativeTextTrack) => (event: NativeEvent<'removecue'>) => {
    const { cue } = event as unknown as { cue: NativeTextTrackCue };
    if (cue) {
      this._facade.dispatchEvent(new DefaultTextTrackEvent(TextTrackEventType.REMOVE_CUE, track.uid, fromNativeCue(cue)));
    }
  };

  private readonly onEnterTextTrackCue = (track: NativeTextTrack) => (event: NativeEvent<'entercue'>) => {
    const { cue } = event as unknown as { cue: NativeTextTrackCue };
    if (cue) {
      this._facade.dispatchEvent(new DefaultTextTrackEvent(TextTrackEventType.ENTER_CUE, track.uid, fromNativeCue(cue)));
    }
  };

  private readonly onExitTextTrackCue = (track: NativeTextTrack) => (event: NativeEvent<'exitcue'>) => {
    const { cue } = event as unknown as { cue: NativeTextTrackCue };
    if (cue) {
      this._facade.dispatchEvent(new DefaultTextTrackEvent(TextTrackEventType.EXIT_CUE, track.uid, fromNativeCue(cue)));
    }
  };

  private readonly onActiveQualityChanged = (trackType: MediaTrackType, track: NativeMediaTrack) => () => {
    const quality = track.activeQuality;
    this._facade.dispatchEvent(
      new DefaultMediaTrackEvent(MediaTrackEventType.ACTIVE_QUALITY_CHANGED, trackType, track.uid, quality ? [quality] : undefined),
    );
  };
}

const FORWARDED_AD_EVENTS: Array<AdEventType> = [
  AdEventType.ADD_AD_BREAK,
  AdEventType.REMOVE_AD_BREAK,
  AdEventType.AD_LOADED,
  AdEventType.AD_BREAK_BEGIN,
  AdEventType.AD_BREAK_END,
  AdEventType.AD_BREAK_CHANGE,
  AdEventType.UPDATE_AD_BREAK,
  AdEventType.ADD_AD,
  AdEventType.AD_BEGIN,
  AdEventType.AD_END,
  AdEventType.UPDATE_AD,
  AdEventType.AD_FIRST_QUARTILE,
  AdEventType.AD_MIDPOINT,
  AdEventType.AD_THIRD_QUARTILE,
  AdEventType.AD_SKIP,
  AdEventType.AD_IMPRESSION,
  AdEventType.AD_ERROR,
  AdEventType.AD_METADATA,
  AdEventType.AD_BUFFERING,
];

function fromTimeRanges(timeRanges: TimeRanges): TimeRange[] {
  const result: TimeRange[] = [];
  for (let i = 0; i < timeRanges.length; i++) {
    result.push({
      start: timeRanges.start(i) * 1e3,
      end: timeRanges.end(i) * 1e3,
    });
  }
  return result;
}
