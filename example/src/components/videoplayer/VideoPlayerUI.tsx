import React, { PureComponent } from 'react';
import {
  addTrack,
  addTextTrackCue,
  AdEvent,
  AirplayStateChangeEvent,
  CastEvent,
  CastEventType,
  ChromecastChangeEvent,
  ChromecastErrorEvent,
  DurationChangeEvent,
  ErrorEvent,
  Event,
  filterThumbnailTracks,
  findTextTrackByUid,
  LoadedMetadataEvent,
  RateChangeEvent,
  MediaTrackEvent,
  MediaTrackEventType,
  MediaTrackListEvent,
  MediaTrackType,
  PlayerEventType,
  ProgressEvent,
  ReadyStateChangeEvent,
  removeTrack,
  removeTextTrackCue,
  TextTrackEvent,
  TextTrackEventType,
  TextTrackListEvent,
  TimeUpdateEvent,
  TrackListEventType,
  PresentationModeChangeEvent,
  VolumeChangeEvent,
} from 'react-native-theoplayer';

import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SeekBar } from '../seekbar/SeekBar';
import styles from './VideoPlayerUI.style';
import { DelayedActivityIndicator } from '../delayedactivityindicator/DelayedActivityIndicator';
import { AirplayIcon, FullScreenExitIcon, FullScreenIcon, PipExitIcon, PipIcon, MutedIcon, PlayButton, UnMutedIcon } from '../../res/images';
import { ActionButton } from '../actionbutton/ActionButton';
import { TimeLabel } from '../timelabel/TimeLabel';
import {
  ENABLE_CAST_BUTTON,
  ENABLE_QUALITY_MENU,
  THUMBNAIL_MODE,
  THUMBNAIL_SIZE,
  VideoPlayerUIProps,
  VideoPlayerUIState,
} from './VideoPlayerUIProps';
import { ThumbnailView } from '../thumbnail/ThumbnailView';
import type { SeekBarPosition } from '../seekbar/SeekBarPosition';
import { VideoQualityMenu } from './VideoQualityMenu';
import { AudioTrackMenu } from './AudioTrackMenu';
import { TextTrackMenu } from './TextTrackMenu';
import { SourceMenu } from './SourceMenu';
import { CastButton } from 'react-native-google-cast';

const TAG = 'VideoPlayerUI';

export class VideoPlayerUI extends PureComponent<VideoPlayerUIProps, VideoPlayerUIState> {
  private static initialState: VideoPlayerUIState = {
    srcIndex: 0,
    playbackRate: 1,
    volume: 1,
    muted: false,
    duration: Number.NaN,
    currentTime: 0.0,
    seekable: [],
    paused: true,
    fullscreen: false,
    pip: false,
    showLoadingIndicator: false,
    textTracks: [],
    videoTracks: [],
    audioTracks: [],
    selectedTextTrack: undefined,
    selectedVideoTrack: undefined,
    targetVideoQuality: undefined,
    selectedAudioTrack: undefined,
    error: undefined,
    message: undefined,
    airplayIsConnected: false,
    chromecastIsConnected: false,
  };

  constructor(props: VideoPlayerUIProps) {
    super(props);
    this.state = VideoPlayerUI.initialState;
    this.addPlayerEventListeners();
    this.props.player.source = this.props.sources[this.state.srcIndex].source;
  }

  componentWillUnmount() {
    this.removePlayerEventListeners();
  }

  private addPlayerEventListeners() {
    const { player } = this.props;
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, console.log);
    player.addEventListener(PlayerEventType.LOADED_DATA, console.log);
    player.addEventListener(PlayerEventType.READYSTATE_CHANGE, this.onReadyStateChange);
    player.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, this.onPresentationModeChange);
    player.addEventListener(PlayerEventType.PLAY, this.onPlay);
    player.addEventListener(PlayerEventType.PLAYING, this.onPlaying);
    player.addEventListener(PlayerEventType.SEEKING, console.log);
    player.addEventListener(PlayerEventType.SEEKED, console.log);
    player.addEventListener(PlayerEventType.ENDED, console.log);
    player.addEventListener(PlayerEventType.WAITING, console.log);
    player.addEventListener(PlayerEventType.LOAD_START, this.onLoadStart);
    player.addEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    player.addEventListener(PlayerEventType.TIME_UPDATE, this.onTimeUpdate);
    player.addEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackListEvent);
    player.addEventListener(PlayerEventType.TEXT_TRACK, this.onTextTrackEvent);
    player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onMediaTrackListEvent);
    player.addEventListener(PlayerEventType.MEDIA_TRACK, this.onMediaTrackEvent);
    player.addEventListener(PlayerEventType.AD_EVENT, this.onAdEvent);
    player.addEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
    player.addEventListener(PlayerEventType.PROGRESS, this.onProgress);
    player.addEventListener(PlayerEventType.RATE_CHANGE, this.onRateChange);
    player.addEventListener(PlayerEventType.VOLUME_CHANGE, this.onVolumeChange);
    player.addEventListener(PlayerEventType.CANPLAY, console.log);
    player.addEventListener(PlayerEventType.ERROR, this.onError);
  }

  private removePlayerEventListeners() {
    const { player } = this.props;
    player.removeEventListener(PlayerEventType.SOURCE_CHANGE, console.log);
    player.removeEventListener(PlayerEventType.LOADED_DATA, console.log);
    player.removeEventListener(PlayerEventType.READYSTATE_CHANGE, this.onReadyStateChange);
    player.removeEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, this.onPresentationModeChange);
    player.removeEventListener(PlayerEventType.PLAY, this.onPlay);
    player.removeEventListener(PlayerEventType.PLAYING, this.onPlaying);
    player.removeEventListener(PlayerEventType.SEEKING, console.log);
    player.removeEventListener(PlayerEventType.SEEKED, console.log);
    player.removeEventListener(PlayerEventType.ENDED, console.log);
    player.removeEventListener(PlayerEventType.WAITING, console.log);
    player.removeEventListener(PlayerEventType.LOAD_START, this.onLoadStart);
    player.removeEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    player.removeEventListener(PlayerEventType.TIME_UPDATE, this.onTimeUpdate);
    player.removeEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    player.removeEventListener(PlayerEventType.TEXT_TRACK_LIST, this.onTextTrackListEvent);
    player.removeEventListener(PlayerEventType.TEXT_TRACK, this.onTextTrackEvent);
    player.removeEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.onMediaTrackListEvent);
    player.removeEventListener(PlayerEventType.MEDIA_TRACK, this.onMediaTrackEvent);
    player.removeEventListener(PlayerEventType.AD_EVENT, this.onAdEvent);
    player.removeEventListener(PlayerEventType.CAST_EVENT, this.onCastEvent);
    player.removeEventListener(PlayerEventType.PROGRESS, this.onProgress);
    player.removeEventListener(PlayerEventType.RATE_CHANGE, this.onRateChange);
    player.removeEventListener(PlayerEventType.VOLUME_CHANGE, this.onVolumeChange);
    player.removeEventListener(PlayerEventType.CANPLAY, console.log);
    player.removeEventListener(PlayerEventType.ERROR, this.onError);
  }

  private onReadyStateChange = (event: ReadyStateChangeEvent) => {
    console.log(event);
    this.maybeShowLoadingIndicator(event.readyState < 3);
  };

  private onPresentationModeChange = (event: PresentationModeChangeEvent) => {
    console.log(TAG, 'presentationModeChange', event.presentationMode);
    if (event.presentationMode === 'fullscreen') {
      this.setState({ pip: false, fullscreen: true });
    } else if (event.presentationMode === 'picture-in-picture') {
      this.setState({ pip: true, fullscreen: false });
    } else {
      // 'inline'
      this.setState({ pip: false, fullscreen: false });
    }
  };

  private onRateChange = (event: RateChangeEvent) => {
    const { playbackRate } = event;
    console.log(event);
    this.setState({ playbackRate });
  };

  private onVolumeChange = (event: VolumeChangeEvent) => {
    const { volume, muted } = event;
    console.log(TAG, 'volumechange: volume =', volume, ', muted =', muted);
    this.setState({ volume, muted });
  };

  private onPlaying = (event: Event<'playing'>) => {
    console.log(event);
    this.setState({ paused: false });
    this.maybeShowLoadingIndicator(false);
  };

  private onLoadStart = () => {
    console.log(TAG, 'loadstart');
    this.maybeShowLoadingIndicator(true);
    this.setState({ error: undefined });
  };

  private onLoadedMetadata = (event: LoadedMetadataEvent) => {
    // console.log(TAG, 'loadedmetadata', JSON.stringify(data));
    this.setState({
      duration: event.duration,
      textTracks: event.textTracks,
      audioTracks: event.audioTracks,
      videoTracks: event.videoTracks,
      selectedTextTrack: event.selectedTextTrack,
      selectedVideoTrack: event.selectedVideoTrack,
      selectedAudioTrack: event.selectedAudioTrack,
    });
  };

  private onPlay = () => {
    console.log(TAG, 'play');
  };

  private onPause = () => {
    console.log(TAG, 'pause');
    this.setState({ paused: true });
  };

  private onTimeUpdate = (event: TimeUpdateEvent) => {
    const { currentTime, currentProgramDateTime } = event;
    console.log(TAG, 'timeupdate', currentTime, currentProgramDateTime);
    this.setState({ currentTime });
  };

  private onDurationChange = (event: DurationChangeEvent) => {
    const { duration } = event;
    console.log(TAG, 'durationchange', duration);
    this.setState({ duration });
  };

  private onTextTrackListEvent = (event: TextTrackListEvent) => {
    const { textTracks } = this.state;
    const { track } = event;
    switch (event.subType) {
      case TrackListEventType.ADD_TRACK:
        this.setState({ textTracks: addTrack(textTracks, track) });
        break;
      case TrackListEventType.REMOVE_TRACK:
        this.setState({ textTracks: removeTrack(textTracks, track) });
        break;
    }
    console.log(TAG, `onTextTrackListEvent: ${stringFromTextTrackListEvent(event.subType)} track`, track.uid);
  };

  private onTextTrackEvent = (event: TextTrackEvent) => {
    const { textTracks } = this.state;
    const { trackUid, cue } = event;
    const track = findTextTrackByUid(textTracks, trackUid);
    if (track) {
      switch (event.subType) {
        case TextTrackEventType.ADD_CUE:
          addTextTrackCue(track, cue);
          break;
        case TextTrackEventType.REMOVE_CUE:
          removeTextTrackCue(track, cue);
          break;
      }
    }
    //console.log(TAG, `onTextTrackEvent: ${stringFromTextTrackEvent(event.subType)} track`, trackUid);
  };

  private onMediaTrackListEvent = (event: MediaTrackListEvent) => {
    const { subType, track, trackType } = event;
    console.log(TAG, `onMediaTrackListEvent: ${stringFromTextTrackListEvent(subType)} for ${trackType} track`, track.uid);
  };

  private onMediaTrackEvent = (event: MediaTrackEvent) => {
    const { trackType, trackUid } = event;
    let typeStr;
    const trackTypeStr = trackType === MediaTrackType.VIDEO ? 'video' : 'audio';
    switch (event.subType) {
      case MediaTrackEventType.ACTIVE_QUALITY_CHANGED:
        typeStr = 'ActiveQualityChanged';
        break;
    }
    console.log(TAG, `onMediaTrackEvent: ${typeStr} ${trackTypeStr} track`, trackUid, event.qualities);
  };

  private onAdEvent = (event: AdEvent) => {
    const { subType, ad } = event;
    console.log(TAG, 'onAdEvent', subType, ad);
  };

  private onCastStateChangeEvent = (event: ChromecastChangeEvent | AirplayStateChangeEvent) => {
    const stateEvent = event;
    let message = undefined;
    const castTarget = event.subType === CastEventType.CHROMECAST_STATE_CHANGE ? 'chromecast' : 'airplay';
    switch (stateEvent.state) {
      case 'connecting':
        message = `Connecting to ${castTarget} ...`;
        break;
      case 'connected':
        message = `Connected to ${castTarget} ...`;
        break;
    }
    this.setState({
      message,
      airplayIsConnected: castTarget === 'airplay' && (stateEvent.state === 'connecting' || stateEvent.state === 'connected'),
      chromecastIsConnected: castTarget === 'chromecast' && (stateEvent.state === 'connecting' || stateEvent.state === 'connected'),
    });
  };

  private onChromecastErrorEvent = (event: ChromecastErrorEvent) => {
    this.setState({
      error: {
        errorCode: event.error.errorCode,
        errorMessage: event.error.description,
      },
    });
  };

  private onCastEvent = (event: CastEvent) => {
    console.log(TAG, 'onCastEvent', event);
    if (event.subType == CastEventType.CHROMECAST_STATE_CHANGE || event.subType == CastEventType.AIRPLAY_STATE_CHANGE) {
      this.onCastStateChangeEvent(event);
    } else {
      this.onChromecastErrorEvent(event);
    }
  };

  private onProgress = (event: ProgressEvent) => {
    const { seekable, buffered } = event;
    console.log(TAG, 'progress', seekable, 'buffered', buffered);
    this.setState({ seekable });
  };

  private onError = (event: ErrorEvent) => {
    const { error } = event;
    this.maybeShowLoadingIndicator(false);
    this.setState({ error });
  };

  private onSeek = (time: number) => {
    console.log(TAG, 'Seeking to', time);
    if (!isNaN(time)) {
      this.props.player.currentTime = time;
    }
  };

  private onSelectTextTrack = (uid: number | undefined) => {
    const { player } = this.props;
    player.selectedTextTrack = uid;
    this.setState({ selectedTextTrack: uid });
  };

  private onSelectAudioTrack = (uid: number | undefined) => {
    const { player } = this.props;
    player.selectedAudioTrack = uid;
    this.setState({ selectedAudioTrack: uid });
  };

  private onSelectTargetVideoQuality = (uid: number | number[] | undefined) => {
    const { player } = this.props;
    player.targetVideoQuality = uid;
    this.setState({ targetVideoQuality: uid });
  };

  private onSelectSource = (srcIndex: number) => {
    const { player, sources } = this.props;
    const { airplayIsConnected, chromecastIsConnected } = this.state;
    this.setState({
      ...VideoPlayerUI.initialState,
      srcIndex,
      airplayIsConnected,
      chromecastIsConnected,
    });
    player.source = sources[srcIndex].source;
  };

  private toggleAirplay = () => {
    const { player } = this.props;
    if (Platform.OS === 'ios' && !Platform.isTV) {
      player.cast.airplay?.state().then((airplayCastState) => {
        const inConnection = airplayCastState === 'connected' || airplayCastState === 'connecting';
        if (inConnection) {
          player.cast.airplay?.stop();
        } else {
          player.cast.airplay?.start();
        }
      });
    }
  };

  private togglePlayPause = () => {
    const { player } = this.props;
    const { paused } = this.state;
    if (paused) {
      player.play();
    } else {
      player.pause();
    }
    this.setState({ paused: !paused });
  };

  private toggleFullScreen = () => {
    const { player } = this.props;
    console.log(TAG, 'toggle fullscreen');
    const wasFullscreen = player.presentationMode == 'fullscreen';
    player.presentationMode = wasFullscreen ? 'inline' : 'fullscreen';
    this.setState({ fullscreen: !wasFullscreen, pip: false });
  };

  private togglePip = () => {
    const { player } = this.props;
    console.log(TAG, 'toggle pip');
    const wasPip = player.presentationMode == 'picture-in-picture';
    player.presentationMode = wasPip ? 'inline' : 'picture-in-picture';
    this.setState({ pip: !wasPip, fullscreen: false });
  };

  private toggleMuted = () => {
    const { player } = this.props;
    const newMuted = !player.muted;

    player.muted = newMuted;
    this.setState({ muted: newMuted });
  };

  private maybeShowLoadingIndicator(showLoading: boolean) {
    const { error, paused } = this.state;
    // do not change state to buffering in case of an error or if the player is paused
    this.setState({ showLoadingIndicator: showLoading && !error && !paused });
  }

  private renderThumbnailCarousel = (seekBarPosition: SeekBarPosition) => {
    const { textTracks } = this.state;
    const thumbnailTrack = filterThumbnailTracks(textTracks);
    if (!thumbnailTrack) {
      return;
    }
    return (
      <ThumbnailView
        visible={seekBarPosition.isScrubbing}
        containerStyle={styles.thumbnailContainerCarousel}
        thumbnailStyleCurrent={styles.thumbnailCurrentCarousel}
        thumbnailStyleCarousel={styles.thumbnailCarousel}
        thumbnailTrack={thumbnailTrack}
        time={seekBarPosition.currentProgress}
        duration={seekBarPosition.duration}
        size={THUMBNAIL_SIZE}
        carouselCount={2}
        // Optionally scale down the thumbnails when further from currentTime.
        // carouselThumbnailScale={(index: number) => 1.0 - Math.abs(index) * 0.15}
      />
    );
  };

  private renderSingleThumbnail = (seekBarPosition: SeekBarPosition) => {
    const { textTracks } = this.state;
    const thumbnailTrack = filterThumbnailTracks(textTracks);
    if (!thumbnailTrack) {
      return;
    }
    return (
      <ThumbnailView
        visible={seekBarPosition.isScrubbing}
        containerStyle={styles.thumbnailContainerSingle}
        thumbnailStyleCurrent={styles.thumbnailCurrentSingle}
        thumbnailTrack={thumbnailTrack}
        duration={seekBarPosition.duration}
        time={seekBarPosition.currentProgress}
        size={THUMBNAIL_SIZE}
        showTimeLabel={false}
        offset={Math.min(
          seekBarPosition.seekBarWidth - THUMBNAIL_SIZE,
          Math.max(0, seekBarPosition.currentProgressPercentage * seekBarPosition.seekBarWidth - 0.5 * THUMBNAIL_SIZE),
        )}
      />
    );
  };

  private shouldShowControls(): boolean {
    const { pip } = this.state;
    // On Android, the UI controls need to disappear when going to PiP
    return !(Platform.OS === 'android' && pip);
  }

  render() {
    const { style, sources } = this.props;

    const {
      srcIndex,
      error,
      message,
      paused,
      muted,
      airplayIsConnected,
      chromecastIsConnected,
      fullscreen,
      pip,
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

    const showControls = this.shouldShowControls();

    return (
      <View style={[styles.container, style]}>
        {/*Background*/}
        {showControls && <View style={styles.background} />}

        {!Platform.isTV && showControls && (
          <View style={styles.topContainer}>
            {/*Airplay button*/}
            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.castButton} onPress={this.toggleAirplay}>
                <Image style={[styles.castIcon, { tintColor: airplayIsConnected ? '#ffc50f' : 'white' }]} source={AirplayIcon} />
              </TouchableOpacity>
            )}
            {/*Chromecast button*/}
            {ENABLE_CAST_BUTTON && <CastButton style={styles.castButton} tintColor={chromecastIsConnected ? '#ffc50f' : 'white'} />}
          </View>
        )}

        {showLoadingIndicator && !paused && (
          <View style={styles.fullScreenCenter}>
            <DelayedActivityIndicator size="large" color="#ffc50f" />
          </View>
        )}

        {!error && showControls && (
          <ActionButton
            touchable={!Platform.isTV}
            icon={paused ? PlayButton : null}
            style={styles.fullScreenCenter}
            iconStyle={styles.playButton}
            onPress={this.togglePlayPause}
          />
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.message}>
              {error.errorCode} - {error.errorMessage}
            </Text>
          </View>
        )}

        {showControls && (
          <View style={styles.controlsContainer}>
            {message && <Text style={styles.message}>{message}</Text>}

            <SeekBar
              // On TV platforms we use the progress dot to play/pause
              onDotPress={this.togglePlayPause}
              onSeek={this.onSeek}
              seekable={seekable}
              duration={duration}
              currentTime={currentTime}
              renderTopComponent={THUMBNAIL_MODE === 'carousel' ? this.renderThumbnailCarousel : this.renderSingleThumbnail}
            />

            <View style={styles.bottomControlsContainer}>
              {/*Mute*/}
              <ActionButton style={{ marginLeft: 0 }} icon={muted ? MutedIcon : UnMutedIcon} onPress={this.toggleMuted} iconStyle={styles.menuIcon} />

              {/*TimeLabel*/}
              <TimeLabel style={styles.timeLabel} isLive={!isFinite(duration)} currentTime={currentTime} duration={duration} />

              {/*Spacer*/}
              <View style={{ flexGrow: 1 }} />

              {/*TextTrack menu */}
              <TextTrackMenu textTracks={textTracks} selectedTextTrack={selectedTextTrack} onSelectTextTrack={this.onSelectTextTrack} />

              {/*AudioTrack menu */}
              <AudioTrackMenu audioTracks={audioTracks} selectedAudioTrack={selectedAudioTrack} onSelectAudioTrack={this.onSelectAudioTrack} />

              {/*Video quality menu. Note: quality selection is not available on iOS */}
              {ENABLE_QUALITY_MENU && (
                <VideoQualityMenu
                  videoTracks={videoTracks}
                  selectedVideoTrack={selectedVideoTrack}
                  targetVideoTrackQuality={targetVideoQuality}
                  onSelectTargetVideoQuality={this.onSelectTargetVideoQuality}
                />
              )}

              {/*Source menu */}
              <SourceMenu sources={sources} selectedSourceIndex={srcIndex} onSelectSource={this.onSelectSource} />

              {/*Pip*/}
              {!Platform.isTV && <ActionButton icon={pip ? PipExitIcon : PipIcon} onPress={this.togglePip} iconStyle={styles.menuIcon} />}

              {/*Fullscreen*/}
              {!Platform.isTV && (
                <ActionButton icon={fullscreen ? FullScreenExitIcon : FullScreenIcon} onPress={this.toggleFullScreen} iconStyle={styles.menuIcon} />
              )}
            </View>
          </View>
        )}
      </View>
    );
  }
}

function stringFromTextTrackListEvent(type: TrackListEventType): string {
  switch (type) {
    case TrackListEventType.ADD_TRACK:
      return 'AddTrack';
    case TrackListEventType.REMOVE_TRACK:
      return 'RemoveTrack';
    case TrackListEventType.CHANGE_TRACK:
      return 'ChangeTrack';
  }
}

// function stringFromTextTrackEvent(type: TextTrackEventType): string {
//   switch (type) {
//     case TextTrackEventType.ADD_CUE:
//       return 'AddCue';
//     case TextTrackEventType.REMOVE_CUE:
//       return 'RemoveCue';
//     case TextTrackEventType.ENTER_CUE:
//       return 'EnterCue';
//     case TextTrackEventType.EXIT_CUE:
//       return 'ExitCue';
//   }
// }
