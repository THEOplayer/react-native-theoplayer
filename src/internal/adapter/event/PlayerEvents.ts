import { BaseEvent } from './BaseEvent';
import {
  Ad,
  AdBreak,
  AdEvent,
  AdEventType,
  AirplayStateChangeEvent,
  CastEventType,
  CastState,
  ChromecastChangeEvent,
  ChromecastError,
  ChromecastErrorEvent,
  DimensionChangeEvent,
  DurationChangeEvent,
  ErrorEvent,
  Interstitial,
  LoadedMetadataEvent,
  MediaTrack,
  MediaTrackEvent,
  MediaTrackEventType,
  MediaTrackListEvent,
  MediaTrackType,
  PlayerError,
  PlayerEventType,
  PresentationMode,
  PresentationModeChangeContext,
  PresentationModeChangeEvent,
  ProgressEvent,
  Quality,
  RateChangeEvent,
  ReadyStateChangeEvent,
  ResizeEvent,
  SeekedEvent,
  SeekingEvent,
  SegmentNotFoundEvent,
  TextTrack,
  TextTrackCue,
  TextTrackEvent,
  TextTrackEventType,
  TextTrackListEvent,
  TheoAdsErrorEvent,
  TheoAdsEvent,
  TheoAdsEventType,
  TheoLiveDistributionEvent,
  TheoLiveDistributionLoadedEvent,
  TheoLiveEndpoint,
  TheoLiveEndpointLoadedEvent,
  TheoLiveEvent,
  TheoLiveEventType,
  TheoLiveIntentToFallbackEvent,
  TimeRange,
  TimeUpdateEvent,
  TrackListEventType,
  VideoResizeEvent,
  VolumeChangeEvent,
} from 'react-native-theoplayer';
import { TheoLiveDistribution } from '../../../api/theolive/TheoLiveDistribution';

export class DefaultLoadedMetadataEvent extends BaseEvent<PlayerEventType.LOADED_METADATA> implements LoadedMetadataEvent {
  constructor(
    public textTracks: TextTrack[],
    public audioTracks: MediaTrack[],
    public videoTracks: MediaTrack[],
    public duration: number,
    public selectedTextTrack: number | undefined,
    public selectedVideoTrack: number | undefined,
    public selectedAudioTrack: number | undefined,
  ) {
    super(PlayerEventType.LOADED_METADATA);
  }
}

export class DefaultReadyStateChangeEvent extends BaseEvent<PlayerEventType.READYSTATE_CHANGE> implements ReadyStateChangeEvent {
  constructor(public readyState: number) {
    super(PlayerEventType.READYSTATE_CHANGE);
  }
}

export class DefaultPresentationModeChangeEvent extends BaseEvent<PlayerEventType.PRESENTATIONMODE_CHANGE> implements PresentationModeChangeEvent {
  constructor(
    public presentationMode: PresentationMode,
    public previousPresentationMode: PresentationMode,
    public context?: PresentationModeChangeContext,
  ) {
    super(PlayerEventType.PRESENTATIONMODE_CHANGE);
  }
}

export class DefaultVolumeChangeEvent extends BaseEvent<PlayerEventType.VOLUME_CHANGE> implements VolumeChangeEvent {
  constructor(
    public volume: number,
    public muted: boolean,
  ) {
    super(PlayerEventType.VOLUME_CHANGE);
  }
}

/**
 * @deprecated Use {@link DefaultDimensionChangeEvent} instead. This event is set for removal in version 11.
 */
export class DefaultResizeEvent extends BaseEvent<PlayerEventType.RESIZE> implements ResizeEvent {
  constructor(
    public width: number,
    public height: number,
  ) {
    super(PlayerEventType.RESIZE);
  }
}

export class DefaultDimensionChangeEvent extends BaseEvent<PlayerEventType.DIMENSION_CHANGE> implements DimensionChangeEvent {
  constructor(
    public width: number,
    public height: number,
  ) {
    super(PlayerEventType.DIMENSION_CHANGE);
  }
}

export class DefaultVideoResizeEvent extends BaseEvent<PlayerEventType.VIDEO_RESIZE> implements VideoResizeEvent {
  constructor(
    public videoWidth: number,
    public videoHeight: number,
  ) {
    super(PlayerEventType.VIDEO_RESIZE);
  }
}

export class DefaultErrorEvent extends BaseEvent<PlayerEventType.ERROR> implements ErrorEvent {
  constructor(public error: PlayerError) {
    super(PlayerEventType.ERROR);
  }
}

export class DefaultProgressEvent extends BaseEvent<PlayerEventType.PROGRESS> implements ProgressEvent {
  constructor(
    public seekable: TimeRange[],
    public buffered: TimeRange[],
  ) {
    super(PlayerEventType.PROGRESS);
  }
}

export class DefaultTimeupdateEvent extends BaseEvent<PlayerEventType.TIME_UPDATE> implements TimeUpdateEvent {
  constructor(
    public currentTime: number,
    public currentProgramDateTime?: number,
  ) {
    super(PlayerEventType.TIME_UPDATE);
  }
}

export class DefaultDurationChangeEvent extends BaseEvent<PlayerEventType.DURATION_CHANGE> implements DurationChangeEvent {
  constructor(public duration: number) {
    super(PlayerEventType.DURATION_CHANGE);
  }
}

export class DefaultRateChangeEvent extends BaseEvent<PlayerEventType.RATE_CHANGE> implements RateChangeEvent {
  constructor(public playbackRate: number) {
    super(PlayerEventType.RATE_CHANGE);
  }
}

export class DefaultSegmentNotFoundEvent extends BaseEvent<PlayerEventType.SEGMENT_NOT_FOUND> implements SegmentNotFoundEvent {
  constructor(
    public readonly segmentStartTime: number,
    public error: string,
    public retryCount: number,
  ) {
    super(PlayerEventType.SEGMENT_NOT_FOUND);
  }
}

export class DefaultSeekingEvent extends BaseEvent<PlayerEventType.SEEKING> implements SeekingEvent {
  constructor(public readonly currentTime: number) {
    super(PlayerEventType.SEEKING);
  }
}

export class DefaultSeekedEvent extends BaseEvent<PlayerEventType.SEEKED> implements SeekedEvent {
  constructor(public readonly currentTime: number) {
    super(PlayerEventType.SEEKED);
  }
}

export class DefaultTextTrackListEvent extends BaseEvent<PlayerEventType.TEXT_TRACK_LIST> implements TextTrackListEvent {
  constructor(
    public subType: TrackListEventType,
    public track: TextTrack,
  ) {
    super(PlayerEventType.TEXT_TRACK_LIST);
  }
}

export class DefaultTextTrackEvent extends BaseEvent<PlayerEventType.TEXT_TRACK> implements TextTrackEvent {
  constructor(
    public subType: TextTrackEventType,
    public trackUid: number,
    public cue: TextTrackCue,
  ) {
    super(PlayerEventType.TEXT_TRACK);
  }
}

export class DefaultMediaTrackListEvent extends BaseEvent<PlayerEventType.MEDIA_TRACK_LIST> implements MediaTrackListEvent {
  constructor(
    public subType: TrackListEventType,
    public trackType: MediaTrackType,
    public track: MediaTrack,
  ) {
    super(PlayerEventType.MEDIA_TRACK_LIST);
  }
}

export class DefaultMediaTrackEvent extends BaseEvent<PlayerEventType.MEDIA_TRACK> implements MediaTrackEvent {
  constructor(
    public subType: MediaTrackEventType,
    public trackType: MediaTrackType,
    public trackUid: number,
    public qualities?: Quality | Quality[],
  ) {
    super(PlayerEventType.MEDIA_TRACK);
  }
}

export class DefaultAdEvent extends BaseEvent<PlayerEventType.AD_EVENT> implements AdEvent {
  constructor(
    public subType: AdEventType,
    public ad: Ad | AdBreak,
  ) {
    super(PlayerEventType.AD_EVENT);
  }
}

export class DefaultTheoAdsEvent extends BaseEvent<PlayerEventType.THEOADS_EVENT> implements TheoAdsEvent {
  constructor(
    public subType: TheoAdsEventType,
    public interstitial: Interstitial,
  ) {
    super(PlayerEventType.THEOADS_EVENT);
  }
}

export class DefaultTheoAdsErrorEvent extends BaseEvent<PlayerEventType.THEOADS_EVENT> implements TheoAdsErrorEvent {
  constructor(
    public subType: TheoAdsEventType,
    public interstitial: Interstitial,
    public message: string | undefined,
  ) {
    super(PlayerEventType.THEOADS_EVENT);
  }
}

export class DefaultTheoLiveEvent extends BaseEvent<PlayerEventType.THEOLIVE_EVENT> implements TheoLiveEvent {
  constructor(public subType: TheoLiveEventType) {
    super(PlayerEventType.THEOLIVE_EVENT);
  }
}

export class DefaultTheoLiveDistributionEvent extends BaseEvent<PlayerEventType.THEOLIVE_EVENT> implements TheoLiveDistributionEvent {
  constructor(
    public subType: TheoLiveEventType,
    public distributionId: string,
  ) {
    super(PlayerEventType.THEOLIVE_EVENT);
  }
}

export class DefaultTheoLiveDistributionLoadedEvent extends BaseEvent<PlayerEventType.THEOLIVE_EVENT> implements TheoLiveDistributionLoadedEvent {
  constructor(
    public subType: TheoLiveEventType,
    public distribution?: TheoLiveDistribution,
  ) {
    super(PlayerEventType.THEOLIVE_EVENT);
  }
}

export class DefaultTheoLiveEndpointLoadedEvent extends BaseEvent<PlayerEventType.THEOLIVE_EVENT> implements TheoLiveEndpointLoadedEvent {
  constructor(
    public subType: TheoLiveEventType,
    public endpoint?: TheoLiveEndpoint,
  ) {
    super(PlayerEventType.THEOLIVE_EVENT);
  }
}

export class DefaultTheoLiveIntentToFallbackEvent extends BaseEvent<PlayerEventType.THEOLIVE_EVENT> implements TheoLiveIntentToFallbackEvent {
  constructor(
    public subType: TheoLiveEventType,
    public reason?: PlayerError,
  ) {
    super(PlayerEventType.THEOLIVE_EVENT);
  }
}

export class DefaultChromecastChangeEvent extends BaseEvent<PlayerEventType.CAST_EVENT> implements ChromecastChangeEvent {
  readonly subType: CastEventType.CHROMECAST_STATE_CHANGE;

  constructor(public state: CastState) {
    super(PlayerEventType.CAST_EVENT);
    this.subType = CastEventType.CHROMECAST_STATE_CHANGE;
  }
}

export class DefaultAirplayStateChangeEvent extends BaseEvent<PlayerEventType.CAST_EVENT> implements AirplayStateChangeEvent {
  readonly subType: CastEventType.AIRPLAY_STATE_CHANGE;

  constructor(public state: CastState) {
    super(PlayerEventType.CAST_EVENT);
    this.subType = CastEventType.AIRPLAY_STATE_CHANGE;
  }
}

export class DefaultChromecastErrorEvent extends BaseEvent<PlayerEventType.CAST_EVENT> implements ChromecastErrorEvent {
  readonly subType: CastEventType.CHROMECAST_ERROR;

  constructor(public error: ChromecastError) {
    super(PlayerEventType.CAST_EVENT);
    this.subType = CastEventType.CHROMECAST_ERROR;
  }
}
