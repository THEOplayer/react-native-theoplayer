/* eslint-disable @typescript-eslint/no-empty-object-type */
import { ViewProps } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { DirectEventHandler, Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes';

/**
 * Notes:
 * - Codegen cannot process imported API types. We need to redefine them here.
 * - Definitions for event types are limited, we are unable to use:
 *    - custom-defined types.
 *    - Union types.
 *    - ReadonlyArray.
 */

type NativeGoogleImaConfiguration = Readonly<{
  ppid?: string;
  maxRedirects?: Int32;
  // TODO: object type not supported
  // featureFlags?: { [flag: string]: string }
  autoPlayAdBreaks?: boolean;
  sessionID?: string;
  enableDebugMode?: boolean;
  bitrate?: Int32;
}>;

type NativeAdsConfiguration = Readonly<{
  allowedMimeTypes?: string[];
  uiEnabled?: boolean;
  preload?: string;
  vpaidMode?: string;
  ima?: NativeGoogleImaConfiguration;
  theoads?: boolean;
}>;

type NativePlayerConfiguration = Readonly<{
  libraryLocation?: string;
  mutedAutoplay?: string;
  ads?: NativeAdsConfiguration;
  cast?: Readonly<{
    chromecast?: Readonly<{
      appID?: string;
    }>;
    strategy?: string;
  }>;
  ui?: Readonly<{
    language?: string;
  }>;
  mediaControl?: Readonly<{
    mediaSessionEnabled?: boolean;
    skipForwardInterval?: Double;
    skipBackwardInterval?: Double;
    convertSkipToSeek?: boolean;
  }>;
  license?: string;
  licenseUrl?: string;
  chromeless?: boolean;
  hlsDateRange?: boolean;
  liveOffset?: Double;
}>;

export type NativePlayerStateEvent = Readonly<{
  version: Readonly<{
    version: string;
    playerSuiteVersion: string;
  }>;
  state: Readonly<{}>; // TODO
}>;

export type NativeLoadedMetadataEvent = Readonly<{
  textTracks: Readonly<
    {
      kind: string;
      label: string;
      language: string;
      id: string;
      uid: Int32;
      mode: string;
      type: string;
      cues: Readonly<
        | {
            id: string;
            uid: Int32;
            startTime: Double;
            endTime: Double;
            content: {};
          }[]
        | null
      >;
      src: string;
      forced: boolean;
    }[]
  >;
  audioTracks: Readonly<
    {
      id: string;
      uid: Int32;
      kind: string;
      label: string;
      language: string;
      activeQuality: Readonly<
        | {
            averageBandwidth?: Double;
            bandwidth: Double;
            codecs: string;
            id: string;
            uid: Int32;
            name: string;
            label: string;
            available: boolean;
          }
        | undefined
      >;
      qualities: Readonly<
        {
          averageBandwidth?: Double;
          bandwidth: Double;
          codecs: string;
          id: string;
          uid: Int32;
          name: string;
          label: string;
          available: boolean;
        }[]
      >;
      enabled: boolean;
    }[]
  >;
  videoTracks: Readonly<
    {
      id: string;
      uid: Int32;
      kind: string;
      label: string;
      language: string;
      activeQuality: Readonly<
        | {
            averageBandwidth?: Double;
            bandwidth: Double;
            codecs: string;
            id: string;
            uid: Int32;
            name: string;
            label: string;
            available: boolean;
          }
        | undefined
      >;
      qualities: Readonly<
        {
          averageBandwidth?: Double;
          bandwidth: Double;
          codecs: string;
          id: string;
          uid: Int32;
          name: string;
          label: string;
          available: boolean;
        }[]
      >;
      enabled: boolean;
    }[]
  >;
  duration: Double;
  selectedTextTrack: Int32 | undefined;
  selectedVideoTrack: Int32 | undefined;
  selectedAudioTrack: Int32 | undefined;
}>;

export type NativeReadyStateChangeEvent = Readonly<{
  readyState: Int32;
}>;

export type NativeErrorEvent = Readonly<{
  error: Readonly<{
    errorCode: string;
    errorMessage: string;
  }>;
}>;

export type NativeProgressEvent = Readonly<{
  seekable: {
    start: Double;
    end: Double;
  }[];
  buffered: {
    start: Double;
    end: Double;
  }[];
}>;

export type NativeVolumeChangeEvent = Readonly<{
  volume: Double;
  muted: boolean;
}>;

export type NativeTimeUpdateEvent = Readonly<{
  currentTime: Double;
  currentProgramDateTime?: Double;
}>;

export type NativeDurationChangeEvent = Readonly<{
  duration: Double;
}>;

export type NativeRateChangeEvent = Readonly<{
  playbackRate: Double;
}>;

export type NativeSegmentNotFoundEvent = Readonly<{
  segmentStartTime: Double;
  error: string;
  retryCount: Int32;
}>;

export type NativeTrackListEvent = Readonly<{
  type: Int32;
}>;

type EventWithTextTrack = Readonly<{
  track: Readonly<{
    kind: string;
    label: string;
    language: string;
    id: string;
    uid: Int32;
    mode: string;
    type: string;
    cues: Readonly<
      | {
          id: string;
          uid: Int32;
          startTime: Double;
          endTime: Double;
          content: {};
        }[]
      | null
    >;
    src: string;
    forced: boolean;
  }>;
}>;

export interface NativeTextTrackListEvent extends NativeTrackListEvent, EventWithTextTrack {}

export type NativeTextTrackEvent = Readonly<{
  type: Int32;
  trackUid: Int32;
  cue: {
    id: string;
    uid: Int32;
    startTime: Double;
    endTime: Double;
    content: {};
  };
}>;

type EventWithMediaTrack = Readonly<{
  track: Readonly<{
    id: string;
    uid: Int32;
    kind: string;
    label: string;
    language: string;
    activeQuality: Readonly<
      | {
          averageBandwidth?: Double;
          bandwidth: Double;
          codecs: string;
          id: string;
          uid: Int32;
          name: string;
          label: string;
          available: boolean;
        }
      | undefined
    >;
    qualities: Readonly<
      {
        averageBandwidth?: Double;
        bandwidth: Double;
        codecs: string;
        id: string;
        uid: Int32;
        name: string;
        label: string;
        available: boolean;
      }[]
    >;
    enabled: boolean;
  }>;
}>;

export interface NativeMediaTrackListEvent extends NativeTrackListEvent, EventWithMediaTrack {
  trackType: Int32;
}

export type NativeMediaTrackEvent = Readonly<{
  type: Int32;
  trackType: Int32;
  trackUid: Int32;
  qualities?: Readonly<
    {
      averageBandwidth?: Double;
      bandwidth: Double;
      codecs: string;
      id: string;
      uid: Int32;
      name: string;
      label: string;
      available: boolean;
    }[]
  >; // Note: unable to use union type '{} | {}[]'
}>;

export type NativeAdEvent = Readonly<{
  type: string;
  ad: Readonly<{
    adSystem: string | undefined;
    integration?: string;
    type: string;
    id: string | undefined;
    readyState?: string;
    adBreak: Readonly<{
      integration?: string;
      timeOffset: Double;
      maxDuration: Double | undefined;
      maxRemainingDuration: Double | undefined;
      // Not nesting ads again here
    }>;
    duration?: Double;
    width: Double | undefined;
    height: Double | undefined;
    resourceURI?: string;
    clickThrough: string | undefined;
    companions: Readonly<{
      adSlotId?: string;
      altText: string;
      contentHTML: string;
      clickThrough?: string;
      width: Double;
      height: Double;
      resourceURI: string;
    }>;
    skipOffset: Double | undefined;
    creativeId: string | undefined;
    universalAdIds: Readonly<
      {
        adIdRegistry: string;
        adIdValue: string;
      }[]
    >;
    // AdBreak properties
    ads: Readonly<
      | {
          adSystem: string | undefined;
          integration?: string;
          type: string;
          id: string | undefined;
          readyState?: string;
          duration?: Double;
          width: Double | undefined;
          height: Double | undefined;
          resourceURI?: string;
          clickThrough: string | undefined;
          companions: Readonly<{
            adSlotId?: string;
            altText: string;
            contentHTML: string;
            clickThrough?: string;
            width: Double;
            height: Double;
            resourceURI: string;
          }>;
          skipOffset: Double | undefined;
          creativeId: string | undefined;
          universalAdIds: Readonly<
            {
              adIdRegistry: string;
              adIdValue: string;
            }[]
          >;
        }[]
      | undefined
    >;
    timeOffset: Double;
    maxDuration: Double | undefined;
    maxRemainingDuration: Double | undefined;
  }>;
}>;

export type NativeCastEvent = Readonly<{
  type: string;
  state: string;
  error: Readonly<{
    errorCode: string;
    description: string;
  }>;
}>;

export type NativePresentationModeChangeEvent = Readonly<{
  presentationMode: string;
  previousPresentationMode: string;
  context?: Readonly<{
    pip: string;
  }>;
}>;

export type NativeResizeEvent = Readonly<{
  width: Double;
  height: Double;
}>;

export interface THEOplayerRCTViewProps extends ViewProps {
  config?: NativePlayerConfiguration;
  // ref: React.RefObject<HostComponent<THEOplayerRCTViewProps>>;
  onNativePlayerReady: DirectEventHandler<NativePlayerStateEvent>;
  onNativeSourceChange: DirectEventHandler<{}>;
  onNativeLoadStart: DirectEventHandler<{}>;
  onNativeLoadedData: DirectEventHandler<{}>;
  onNativeLoadedMetadata: DirectEventHandler<NativeLoadedMetadataEvent>;
  onNativeReadyStateChange?: DirectEventHandler<NativeReadyStateChangeEvent>;
  onNativeError: DirectEventHandler<NativeErrorEvent>;
  onNativeProgress: DirectEventHandler<NativeProgressEvent>;
  onNativeVolumeChange: DirectEventHandler<NativeVolumeChangeEvent>;
  onNativeCanPlay: DirectEventHandler<{}>;
  onNativePlay: DirectEventHandler<{}>;
  onNativePlaying: DirectEventHandler<{}>;
  onNativePause: DirectEventHandler<{}>;
  onNativeSeeking: DirectEventHandler<{}>;
  onNativeSeeked: DirectEventHandler<{}>;
  onNativeEnded: DirectEventHandler<{}>;
  onNativeWaiting: DirectEventHandler<{}>;
  onNativeTimeUpdate: DirectEventHandler<NativeTimeUpdateEvent>;
  onNativeDurationChange: DirectEventHandler<NativeDurationChangeEvent>;
  onNativeRateChange: DirectEventHandler<NativeRateChangeEvent>;
  onNativeSegmentNotFound: DirectEventHandler<NativeSegmentNotFoundEvent>;
  onNativeTextTrackListEvent: DirectEventHandler<NativeTextTrackListEvent>;
  onNativeTextTrackEvent: DirectEventHandler<NativeTextTrackEvent>;
  onNativeMediaTrackListEvent: DirectEventHandler<NativeMediaTrackListEvent>;
  onNativeMediaTrackEvent: DirectEventHandler<NativeMediaTrackEvent>;
  onNativeAdEvent: DirectEventHandler<NativeAdEvent>;
  onNativeCastEvent: DirectEventHandler<NativeCastEvent>;
  onNativePresentationModeChange: DirectEventHandler<NativePresentationModeChangeEvent>;
  onNativeResize: DirectEventHandler<NativeResizeEvent>;
}

export default codegenNativeComponent<THEOplayerRCTViewProps>('THEOplayerRCTView');