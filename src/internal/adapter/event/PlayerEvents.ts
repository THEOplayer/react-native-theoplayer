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
  DurationChangeEvent,
  ErrorEvent,
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
  SegmentNotFoundEvent,
  TextTrack,
  TextTrackCue,
  TextTrackEvent,
  TextTrackEventType,
  TextTrackListEvent,
  TimeRange,
  TimeUpdateEvent,
  TrackListEventType,
  VolumeChangeEvent,
} from 'react-native-theoplayer';

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
  constructor(public presentationMode: PresentationMode, public previousPresentationMode: PresentationMode, public context?: PresentationModeChangeContext) {
    super(PlayerEventType.PRESENTATIONMODE_CHANGE);
  }
}

export class DefaultVolumeChangeEvent extends BaseEvent<PlayerEventType.VOLUME_CHANGE> implements VolumeChangeEvent {
  constructor(public volume: number, public muted: boolean) {
    super(PlayerEventType.VOLUME_CHANGE);
  }
}

export class DefaultErrorEvent extends BaseEvent<PlayerEventType.ERROR> implements ErrorEvent {
  constructor(public error: PlayerError) {
    super(PlayerEventType.ERROR);
  }
}

export class DefaultProgressEvent extends BaseEvent<PlayerEventType.PROGRESS> implements ProgressEvent {
  constructor(public seekable: TimeRange[], public buffered: TimeRange[]) {
    super(PlayerEventType.PROGRESS);
  }
}

export class DefaultTimeupdateEvent extends BaseEvent<PlayerEventType.TIME_UPDATE> implements TimeUpdateEvent {
  constructor(public currentTime: number, public currentProgramDateTime?: number) {
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
  constructor(public readonly segmentStartTime: number, public error: string, public retryCount: number) {
    super(PlayerEventType.SEGMENT_NOT_FOUND);
  }
}

export class DefaultTextTrackListEvent extends BaseEvent<PlayerEventType.TEXT_TRACK_LIST> implements TextTrackListEvent {
  constructor(public subType: TrackListEventType, public track: TextTrack) {
    super(PlayerEventType.TEXT_TRACK_LIST);
  }
}

export class DefaultTextTrackEvent extends BaseEvent<PlayerEventType.TEXT_TRACK> implements TextTrackEvent {
  constructor(public subType: TextTrackEventType, public trackUid: number, public cue: TextTrackCue) {
    super(PlayerEventType.TEXT_TRACK);
  }
}

export class DefaultMediaTrackListEvent extends BaseEvent<PlayerEventType.MEDIA_TRACK_LIST> implements MediaTrackListEvent {
  constructor(public subType: TrackListEventType, public trackType: MediaTrackType, public track: MediaTrack) {
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
  constructor(public subType: AdEventType, public ad: Ad | AdBreak) {
    super(PlayerEventType.AD_EVENT);
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
