import React, { PureComponent } from 'react';
import {
  addTextTrack,
  addTextTrackCue,
  AdEvent,
  DurationChangeEvent,
  ErrorEvent,
  findTextTrackByUid,
  LoadedMetadataEvent,
  MediaTrack,
  MediaTrackEvent,
  MediaTrackEventType,
  MediaTrackListEvent,
  MediaTrackType,
  PlayerConfiguration,
  PlayerError,
  ProgressEvent,
  removeTextTrack,
  removeTextTrackCue,
  SourceDescription,
  TextTrack,
  TextTrackEvent,
  TextTrackEventType,
  TextTrackListEvent,
  THEOplayerView,
  TimeRange,
  TimeUpdateEvent,
  TrackListEventType,
} from 'react-native-theoplayer';
import ALL_SOURCES from '../../res/sources.json';

import { Platform, View } from 'react-native';
import styles from './VideoPlayer.style';
import { VideoPlayerUI } from './VideoPlayerUI';
import type { Source } from '../../utils/source/Source';

const TAG = 'VideoPlayer';

const SOURCES = ALL_SOURCES.filter((source) => source.os.indexOf(Platform.OS) >= 0);

export interface VideoPlayerProps {
  config?: PlayerConfiguration;
}

interface VideoPlayerState {
  srcIndex: number;
  playbackRate: number;
  volume: number;
  muted: boolean;
  duration: number;
  seekable: TimeRange[];
  currentTime: number;
  paused: boolean;
  fullscreen: boolean;
  showLoadingIndicator: boolean;
  textTracks: TextTrack[];
  videoTracks: MediaTrack[];
  audioTracks: MediaTrack[];
  selectedTextTrack: number | undefined;
  selectedVideoTrack: number | undefined;
  targetVideoQuality: number | number[] | undefined;
  selectedAudioTrack: number | undefined;
  error: PlayerError | undefined;
}

export class VideoPlayer extends PureComponent<VideoPlayerProps, VideoPlayerState> {
  private static initialState: VideoPlayerState = {
    srcIndex: 0,
    playbackRate: 1,
    volume: 1,
    muted: false,
    duration: Number.NaN,
    currentTime: 0.0,
    seekable: [],
    paused: false,
    fullscreen: false,
    showLoadingIndicator: false,
    textTracks: [],
    videoTracks: [],
    audioTracks: [],
    selectedTextTrack: undefined,
    selectedVideoTrack: undefined,
    targetVideoQuality: undefined,
    selectedAudioTrack: undefined,
    error: undefined,
  };

  private video!: THEOplayerView;

  constructor(props: VideoPlayerProps) {
    super(props);
    this.state = { ...VideoPlayer.initialState };
  }

  private logEvent = (eventName: string) => (data?: unknown) => {
    if (data) {
      console.log(TAG, eventName, JSON.stringify(data));
    } else {
      console.log(TAG, eventName);
    }
  };

  private onLoadStart = () => {
    console.log(TAG, 'loadstart');
    this.setState({ error: undefined });
  };

  private onLoadedMetadata = (data: LoadedMetadataEvent) => {
    // console.log(TAG, 'loadedmetadata', JSON.stringify(data));
    this.setState({
      duration: data.duration,
      textTracks: data.textTracks,
      audioTracks: data.audioTracks,
      videoTracks: data.videoTracks,
      selectedTextTrack: data.selectedTextTrack,
      selectedVideoTrack: data.selectedVideoTrack,
      selectedAudioTrack: data.selectedAudioTrack,
    });
  };

  private onPause = () => {
    console.log(TAG, 'pause');
    this.setState({ paused: true });
  };

  private onTimeUpdate = (data: TimeUpdateEvent) => {
    const { currentTime, currentProgramDateTime } = data;
    console.log(TAG, 'timeupdate', currentTime, currentProgramDateTime);
    this.setState({ currentTime });
  };

  private onDurationChange = (data: DurationChangeEvent) => {
    const { duration } = data;
    console.log(TAG, 'durationchange', duration);
    this.setState({ duration });
  };

  private onTextTrackListEvent = (data: TextTrackListEvent) => {
    const { textTracks } = this.state;
    const { track } = data;
    switch (data.type) {
      case TrackListEventType.AddTrack:
        this.setState({ textTracks: addTextTrack(textTracks, track) });
        break;
      case TrackListEventType.RemoveTrack:
        this.setState({ textTracks: removeTextTrack(textTracks, track) });
        break;
    }
    console.log(TAG, `onTextTrackListEvent: ${stringFromTextTrackListEvent(data.type)} track`, track.uid);
  };

  private onTextTrackEvent = (data: TextTrackEvent) => {
    const { textTracks } = this.state;
    const { trackUid, cue } = data;
    const track = findTextTrackByUid(textTracks, trackUid);
    if (!track) {
      console.warn(TAG, 'onTextTrackCueEvent - Unknown track:', trackUid);
      return;
    }
    switch (data.type) {
      case TextTrackEventType.AddCue:
        addTextTrackCue(track, cue);
        break;
      case TextTrackEventType.RemoveCue:
        removeTextTrackCue(track, cue);
        break;
    }
  };

  private onMediaTrackListEvent = (data: MediaTrackListEvent) => {
    const { type, track, trackType } = data;
    const trackTypeStr = trackType === MediaTrackType.Video ? 'video' : 'audio';
    console.log(TAG, `onMediaTrackListEvent: ${stringFromTextTrackListEvent(type)} for ${trackTypeStr} track`, track.uid);
  };

  private onMediaTrackEvent = (data: MediaTrackEvent) => {
    const { trackType, trackUid } = data;
    let typeStr;
    const trackTypeStr = trackType === MediaTrackType.Video ? 'video' : 'audio';
    switch (data.type) {
      case MediaTrackEventType.ActiveQualityChanged:
        typeStr = 'ActiveQualityChanged';
        break;
    }
    console.log(TAG, `onMediaTrackEvent: ${typeStr} ${trackTypeStr} track`, trackUid, data.qualities);
  };

  private onAdEvent = (data: AdEvent) => {
    const { type, ad } = data;
    console.log(TAG, 'onAdEvent', type, ad);
  };

  private onProgress = (data: ProgressEvent) => {
    const { seekable } = data;
    console.log(TAG, 'progress', seekable);
    this.setState({ seekable });
  };

  private onError = (event: ErrorEvent) => {
    const { error } = event;
    this.setState({ error });
  };

  private onBufferingStateChange = (isBuffering: boolean) => {
    this.setState({ showLoadingIndicator: isBuffering });
  };

  private seek = (time: number) => {
    console.log(TAG, 'Seeking to', time);
    if (!isNaN(time) && this.video) {
      this.video.seek(time);
    }
  };

  private onUISelectTextTrack = (uid: number | undefined) => {
    this.setState({ selectedTextTrack: uid });
  };

  private onUISelectAudioTrack = (uid: number | undefined) => {
    this.setState({ selectedAudioTrack: uid });
  };

  private onUISelectVideoTrack = (uid: number | undefined) => {
    this.setState({ selectedVideoTrack: uid });
  };

  private onUISelectTargetVideoQuality = (uid: number | number[] | undefined) => {
    this.setState({ targetVideoQuality: uid });
  };

  private onUISetPlayPause = (paused: boolean) => {
    this.setState({ paused });
  };

  private onUISelectSource = (srcIndex: number) => {
    this.setState({ ...VideoPlayer.initialState, srcIndex, paused: true });
  };

  private onUISetFullscreen = (fullscreen: boolean) => {
    this.setState({ fullscreen });
  };

  private onUISetMuted = (muted: boolean) => {
    this.setState({ muted });
  };

  private onUISetPlaybackRate = (playbackRate: number) => {
    this.setState({ playbackRate });
  };

  private onUISetVolume = (volume: number) => {
    this.setState({ volume });
  };

  render() {
    const {
      srcIndex,
      error,
      playbackRate,
      paused,
      volume,
      muted,
      fullscreen,
      showLoadingIndicator,
      duration,
      seekable,
      currentTime,
      textTracks,
      selectedTextTrack,
      videoTracks,
      selectedVideoTrack,
      targetVideoQuality,
      audioTracks,
      selectedAudioTrack,
    } = this.state;

    const { config } = this.props;
    const chromeless = config?.chromeless;
    const source = SOURCES[srcIndex].source as SourceDescription;

    return (
      <View style={styles.container}>
        <THEOplayerView
          ref={(ref: THEOplayerView) => {
            this.video = ref;
          }}
          config={config}
          source={source}
          fullscreen={fullscreen}
          style={styles.fullScreen}
          playbackRate={playbackRate}
          paused={paused}
          volume={volume}
          muted={muted}
          selectedTextTrack={selectedTextTrack}
          selectedAudioTrack={selectedAudioTrack}
          selectedVideoTrack={selectedVideoTrack}
          targetVideoQuality={targetVideoQuality}
          onBufferingStateChange={this.onBufferingStateChange}
          onSourceChange={this.logEvent('sourcechange')}
          onLoadStart={this.onLoadStart}
          onLoadedMetadata={this.onLoadedMetadata}
          onLoadedData={this.logEvent('loadeddata')}
          onReadyStateChange={this.logEvent('readystatechange')}
          onError={this.onError}
          onProgress={this.onProgress}
          onPlay={this.logEvent('play')}
          onPlaying={this.logEvent('playing')}
          onPause={this.onPause}
          onSeeking={this.logEvent('seeking')}
          onSeeked={this.logEvent('seeked')}
          onEnded={this.logEvent('ended')}
          onTimeUpdate={this.onTimeUpdate}
          onDurationChange={this.onDurationChange}
          onTextTrackListEvent={this.onTextTrackListEvent}
          onTextTrackEvent={this.onTextTrackEvent}
          onMediaTrackListEvent={this.onMediaTrackListEvent}
          onMediaTrackEvent={this.onMediaTrackEvent}
          onAdEvent={this.onAdEvent}
        />

        {/* Use React-Native UI if a native chromeless (without UI) player is requested. */}
        {(chromeless == true || chromeless == undefined) && (
          <VideoPlayerUI
            sources={SOURCES as Source[]}
            srcIndex={srcIndex}
            playbackRate={playbackRate}
            volume={volume}
            muted={muted}
            duration={duration}
            seekable={seekable}
            currentTime={currentTime}
            paused={paused}
            fullscreen={fullscreen}
            showLoadingIndicator={showLoadingIndicator}
            textTracks={textTracks}
            videoTracks={videoTracks}
            audioTracks={audioTracks}
            selectedTextTrack={selectedTextTrack}
            selectedVideoTrack={selectedVideoTrack}
            targetVideoTrackQuality={targetVideoQuality}
            selectedAudioTrack={selectedAudioTrack}
            error={error}
            onSetPlayPause={this.onUISetPlayPause}
            onSeek={this.seek}
            onSelectSource={this.onUISelectSource}
            onSelectTextTrack={this.onUISelectTextTrack}
            onSelectAudioTrack={this.onUISelectAudioTrack}
            onSelectVideoTrack={this.onUISelectVideoTrack}
            onSelectTargetVideoQuality={this.onUISelectTargetVideoQuality}
            onSetFullScreen={this.onUISetFullscreen}
            onSetMuted={this.onUISetMuted}
            onSetPlaybackRate={this.onUISetPlaybackRate}
            onSetVolume={this.onUISetVolume}
          />
        )}
      </View>
    );
  }
}

function stringFromTextTrackListEvent(type: TrackListEventType): string {
  switch (type) {
    case TrackListEventType.AddTrack:
      return 'AddTrack';
    case TrackListEventType.RemoveTrack:
      return 'RemoveTrack';
    case TrackListEventType.ChangeTrack:
      return 'ChangeTrack';
  }
}
