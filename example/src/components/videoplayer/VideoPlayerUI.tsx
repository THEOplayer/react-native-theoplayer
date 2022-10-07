import React, { PureComponent } from 'react';
import { filterRenderableTracks, filterThumbnailTracks, findMediaTrackByUid, MediaTrack, TextTrack, VideoQuality } from 'react-native-theoplayer';

import { Platform, Text, View } from 'react-native';
import { SeekBar } from '../seekbar/SeekBar';
import styles from './VideoPlayerUI.style';
import { DelayedActivityIndicator } from '../delayedactivityindicator/DelayedActivityIndicator';
import {
  FullScreenIcon,
  FullScreenExitIcon,
  SubtitlesIcon,
  AudioIcon,
  SettingsIcon,
  PlayButton,
  MutedIcon,
  UnMutedIcon,
  ListIcon,
} from '../../res/images';
import { MenuButton } from '../menubutton/MenuButton';
import { MenuItem } from '../modalmenu/MenuItem';
import { getISO639LanguageByCode } from '../../utils/language/Language';
import { ActionButton } from '../actionbutton/ActionButton';
import { TimeLabel } from '../timelabel/TimeLabel';
import type { VideoPlayerUIProps } from './VideoPlayerUIProps';
import { THUMBNAIL_MODE, THUMBNAIL_SIZE } from './VideoPlayerUIProps';
import { ThumbnailView } from '../thumbnail/ThumbnailView';
import type { SeekBarPosition } from '../seekbar/SeekBarPosition';

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

  private selectTextTrack = (index: number) => {
    const { textTracks, onSelectTextTrack } = this.props;
    if (onSelectTextTrack) {
      const uid = textTracks && index >= 0 && index < textTracks.length ? textTracks[index].uid : undefined;
      onSelectTextTrack(uid);
    }
  };

  private selectAudioTrack = (index: number) => {
    const { audioTracks, onSelectAudioTrack } = this.props;
    if (onSelectAudioTrack) {
      if (audioTracks && index >= 0 && index < audioTracks.length) {
        onSelectAudioTrack(audioTracks[index].uid);
      }
    }
  };

  private selectTargetVideoQuality = (index: number | undefined) => {
    const { videoTracks, selectedVideoTrack, onSelectTargetVideoQuality } = this.props;
    if (onSelectTargetVideoQuality) {
      if (!videoTracks || !selectedVideoTrack) {
        return;
      }
      const videoTrack = videoTracks.find((track) => track.uid === selectedVideoTrack);
      const qualities = videoTrack?.qualities;
      if (!qualities) {
        return;
      }
      if (index && index >= 0 && index < qualities.length) {
        onSelectTargetVideoQuality(qualities[index].uid);
      } else {
        // deselect target quality
        onSelectTargetVideoQuality(undefined);
      }
    }
  };

  private selectSource = (index: number) => {
    const { onSelectSource } = this.props;
    if (onSelectSource) {
      onSelectSource(index);
    }
  };

  private getTrackLabel = (track: MediaTrack | TextTrack): string => {
    if (track.label) {
      return track.label;
    }
    const languageCode: string = track.language;
    if (languageCode) {
      const iso639Language = getISO639LanguageByCode(languageCode);
      if (iso639Language) {
        return iso639Language.local;
      }
    }
    return languageCode || '';
  };

  private getQualityLabel = (quality: VideoQuality | undefined): string => {
    if (!quality) {
      return 'auto';
    }
    if (quality.label && quality.label !== '') {
      return quality.label;
    }
    let label = '';
    if (quality.height) {
      label = quality.height + 'p';
    }
    if (!quality.bandwidth) {
      return label;
    }
    let bandwidth = '';
    if (quality.bandwidth > 1e7) {
      bandwidth = (quality.bandwidth / 1e6).toFixed(0) + 'Mbps';
    } else if (quality.bandwidth > 1e6) {
      bandwidth = (quality.bandwidth / 1e6).toFixed(1) + 'Mbps';
    } else {
      bandwidth = (quality.bandwidth / 1e3).toFixed(0) + 'kbps';
    }
    const isHD = quality.height ? quality.height >= 720 : false;
    return `${label} - ${bandwidth} ${isHD ? '(HD)' : ''}`;
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
      paused,
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
      targetVideoTrackQuality,
      audioTracks,
      selectedAudioTrack,
    } = this.props;

    const selectableTextTracks = filterRenderableTracks(textTracks);
    const availableVideoQualities = findMediaTrackByUid(videoTracks, selectedVideoTrack)?.qualities || [];

    return (
      <View style={[styles.container, style]}>
        {/*Background*/}
        <View style={styles.background} />

        {showLoadingIndicator && !paused && (
          <View style={styles.fullScreenCenter}>
            <DelayedActivityIndicator size="large" color="#ffc50f" />
          </View>
        )}

        {!error && (
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
            <Text style={styles.error}>
              {error.errorCode} - {error.errorMessage}
            </Text>
          </View>
        )}

        <View style={styles.controlsContainer}>
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
            {selectableTextTracks && selectableTextTracks.length > 0 && (
              <MenuButton
                title={'Subtitles'}
                icon={SubtitlesIcon}
                data={[...selectableTextTracks, null].map((textTrack) =>
                  textTrack ? new MenuItem(this.getTrackLabel(textTrack)) : new MenuItem('None'),
                )}
                onItemSelected={this.selectTextTrack}
                selectedItem={selectedTextTrack ? textTracks.findIndex((textTrack) => textTrack.uid === selectedTextTrack) : textTracks.length}
                keyExtractor={(index: number) => `sub${index}`}
              />
            )}

            {/*AudioTrack menu */}
            {audioTracks && audioTracks.length > 0 && (
              <MenuButton
                title={'Language'}
                icon={AudioIcon}
                data={audioTracks.map((audioTrack) => new MenuItem(this.getTrackLabel(audioTrack)))}
                onItemSelected={this.selectAudioTrack}
                minimumItems={2}
                selectedItem={audioTracks.findIndex((audioTrack) => audioTrack.uid === selectedAudioTrack)}
                keyExtractor={(index: number) => `lng${index}`}
              />
            )}

            {/*Video quality menu */}
            {availableVideoQualities && availableVideoQualities.length > 0 && (
              <MenuButton
                title={'Quality'}
                icon={SettingsIcon}
                data={[...availableVideoQualities, undefined].map((q) => new MenuItem(this.getQualityLabel(q as VideoQuality))).sort()}
                onItemSelected={this.selectTargetVideoQuality}
                minimumItems={2}
                selectedItem={
                  targetVideoTrackQuality
                    ? availableVideoQualities.findIndex((quality) => quality.uid === targetVideoTrackQuality)
                    : availableVideoQualities.length
                }
                keyExtractor={(index: number) => `vq${index}`}
              />
            )}

            {/*Source menu */}
            {sources && sources.length > 0 && (
              <MenuButton
                title={'Source'}
                icon={ListIcon}
                data={sources.map((source) => new MenuItem(source.name))}
                onItemSelected={this.selectSource}
                selectedItem={srcIndex}
                keyExtractor={(index: number) => `src${index}`}
              />
            )}

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
