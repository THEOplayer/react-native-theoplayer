import React, { PureComponent } from 'react';
import { filterThumbnailTracks } from 'react-native-theoplayer';

import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SeekBar } from '../seekbar/SeekBar';
import styles from './VideoPlayerUI.style';
import { DelayedActivityIndicator } from '../delayedactivityindicator/DelayedActivityIndicator';
import { FullScreenIcon, FullScreenExitIcon, PlayButton, MutedIcon, UnMutedIcon, AirplayIcon } from '../../res/images';
import { ActionButton } from '../actionbutton/ActionButton';
import { TimeLabel } from '../timelabel/TimeLabel';
import type { VideoPlayerUIProps } from './VideoPlayerUIProps';
import { THUMBNAIL_MODE, THUMBNAIL_SIZE, ENABLE_QUALITY_MENU, ENABLE_CAST_BUTTON } from './VideoPlayerUIProps';
import { ThumbnailView } from '../thumbnail/ThumbnailView';
import type { SeekBarPosition } from '../seekbar/SeekBarPosition';
import { VideoQualityMenu } from './VideoQualityMenu';
import { AudioTrackMenu } from './AudioTrackMenu';
import { TextTrackMenu } from './TextTrackMenu';
import { SourceMenu } from './SourceMenu';
import { CastButton } from 'react-native-google-cast';

export class VideoPlayerUI extends PureComponent<VideoPlayerUIProps> {
  constructor(props: VideoPlayerUIProps) {
    super(props);
  }

  private onSeek = (time: number) => {
    const { onSeek } = this.props;
    if (onSeek) {
      onSeek(time);
    }
  };

  private togglePlayPause = () => {
    const { paused, onSetPlayPause } = this.props;
    if (onSetPlayPause) {
      onSetPlayPause(!paused);
    }
  };

  private toggleFullScreen = () => {
    const { fullscreen, onSetFullScreen } = this.props;
    if (onSetFullScreen) {
      onSetFullScreen(!fullscreen);
    }
  };

  private toggleMuted = () => {
    const { muted, onSetMuted } = this.props;
    if (onSetMuted) {
      onSetMuted(!muted);
    }
  };

  private toggleAirplay = () => {
    const { onAirplayToggled } = this.props;
    if (onAirplayToggled) {
      onAirplayToggled();
    }
  };

  private renderThumbnailCarousel = (seekBarPosition: SeekBarPosition) => {
    const { textTracks } = this.props;
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
    const { textTracks } = this.props;
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

  render() {
    const {
      style,
      sources,
      srcIndex,
      error,
      message,
      paused,
      muted,
      airplayConnected,
      chromecastConnected,
      fullscreen,
      showLoadingIndicator,
      duration,
      seekable,
      currentTime,
      textTracks,
      selectedTextTrack,
      videoTracks,
      selectedVideoTrack,
      targetVideoTrackQuality,
      audioTracks,
      selectedAudioTrack,
      onSelectSource,
      onSelectTargetVideoQuality,
      onSelectAudioTrack,
      onSelectTextTrack,
    } = this.props;

    return (
      <View style={[styles.container, style]}>
        {/*Background*/}
        <View style={styles.background} />

        {!Platform.isTV && (
          <View style={styles.topContainer}>
            {/*Airplay button*/}
            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.castButton} onPress={this.toggleAirplay}>
                <Image style={[styles.castIcon, { tintColor: airplayConnected ? '#ffc50f' : 'white' }]} source={AirplayIcon} />
              </TouchableOpacity>
            )}
            {/*Chromecast button*/}
            <CastButton style={styles.castButton} tintColor={chromecastConnected ? '#ffc50f' : 'white'} />
          </View>
        )}

        {showLoadingIndicator && !paused && (
          <View style={styles.fullScreenCenter}>
            <DelayedActivityIndicator size="large" color="#ffc50f" />
          </View>
        )}

        {ENABLE_CAST_BUTTON && !error && (
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
            <TextTrackMenu textTracks={textTracks} selectedTextTrack={selectedTextTrack} onSelectTextTrack={onSelectTextTrack} />

            {/*AudioTrack menu */}
            <AudioTrackMenu audioTracks={audioTracks} selectedAudioTrack={selectedAudioTrack} onSelectAudioTrack={onSelectAudioTrack} />

            {/*Video quality menu. Note: quality selection is not available on iOS */}
            {ENABLE_QUALITY_MENU && (
              <VideoQualityMenu
                videoTracks={videoTracks}
                selectedVideoTrack={selectedVideoTrack}
                targetVideoTrackQuality={targetVideoTrackQuality}
                onSelectTargetVideoQuality={onSelectTargetVideoQuality}
              />
            )}

            {/*Source menu */}
            <SourceMenu sources={sources} selectedSourceIndex={srcIndex} onSelectSource={onSelectSource} />

            {/*Fullscreen*/}
            {!Platform.isTV && (
              <ActionButton icon={fullscreen ? FullScreenExitIcon : FullScreenIcon} onPress={this.toggleFullScreen} iconStyle={styles.menuIcon} />
            )}
          </View>
        </View>
      </View>
    );
  }
}
