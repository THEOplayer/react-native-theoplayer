import React, { PureComponent } from 'react';
import { PlayerEventType } from 'react-native-theoplayer';

import { View } from 'react-native';
import { SeekBar } from '../seekbar/SeekBar';
import styles from './VideoPlayerUI.style';
import { THUMBNAIL_MODE, VideoPlayerUIProps } from './VideoPlayerUIProps';
import { AirplayButton } from '../button/AirplayButton';
import { ChromecastButton } from '../button/ChromecastButton';
import { TopControlBar } from '../controlbar/TopControlBar';
import { CenteredDelayedActivityIndicator } from '../delayedactivityindicator/CenteredDelayedActivityIndicator';
import { BigPlayButton } from '../button/BigPlayButton';
import { TimeLabel } from '../timelabel/TimeLabel';
import { FullscreenButton } from '../button/FullscreenButton';
import { TextTrackMenu } from '../menu/TextTrackMenu';
import { AudioTrackMenu } from '../menu/AudioTrackMenu';
import { VideoQualityMenu } from '../menu/VideoQualityMenu';
import { SourceMenu } from '../menu/SourceMenu';
import { MuteButton } from '../button/MuteButton';
import { ErrorDisplay } from '../view/ErrorDisplay';
import { CastMessage } from '../view/CastMessage';
import { PlayerContext } from '../util/Context';

export class VideoPlayerUI extends PureComponent<VideoPlayerUIProps> {
  constructor(props: VideoPlayerUIProps) {
    super(props);
  }

  componentDidMount() {
    // optional logging
    const { player } = this.props;
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, console.log);
    player.addEventListener(PlayerEventType.LOADED_DATA, console.log);
    player.addEventListener(PlayerEventType.LOADED_METADATA, console.log);
    player.addEventListener(PlayerEventType.READYSTATE_CHANGE, console.log);
    player.addEventListener(PlayerEventType.PLAY, console.log);
    player.addEventListener(PlayerEventType.PLAYING, console.log);
    player.addEventListener(PlayerEventType.PAUSE, console.log);
    player.addEventListener(PlayerEventType.SEEKING, console.log);
    player.addEventListener(PlayerEventType.SEEKED, console.log);
    player.addEventListener(PlayerEventType.ENDED, console.log);
  }

  componentWillUnmount() {
    // remove optional logging
    const { player } = this.props;
    player.removeEventListener(PlayerEventType.SOURCE_CHANGE, console.log);
    player.removeEventListener(PlayerEventType.LOADED_DATA, console.log);
    player.removeEventListener(PlayerEventType.LOADED_METADATA, console.log);
    player.removeEventListener(PlayerEventType.READYSTATE_CHANGE, console.log);
    player.removeEventListener(PlayerEventType.PLAY, console.log);
    player.removeEventListener(PlayerEventType.PLAYING, console.log);
    player.removeEventListener(PlayerEventType.PAUSE, console.log);
    player.removeEventListener(PlayerEventType.SEEKING, console.log);
    player.removeEventListener(PlayerEventType.SEEKED, console.log);
    player.removeEventListener(PlayerEventType.ENDED, console.log);
  }

  render() {
    console.log('rendering UI');

    const { style, player } = this.props;

    return (
      <PlayerContext.Provider value={player}>
        <View style={[styles.container, style]}>
          {/*Background*/}
          <View style={styles.background} />

          <TopControlBar>
            <AirplayButton />
            <ChromecastButton />
          </TopControlBar>

          <CenteredDelayedActivityIndicator />

          <BigPlayButton />

          <ErrorDisplay />

          <View style={styles.controlsContainer}>
            <CastMessage />

            <SeekBar thumbnailMode={THUMBNAIL_MODE} />

            <View style={styles.bottomControlsContainer}>
              <MuteButton />
              <TimeLabel showDuration={true} style={styles.timeLabel} />

              {/*Spacer*/}
              <View style={{ flexGrow: 1 }} />

              <TextTrackMenu />

              <AudioTrackMenu />

              {/*Note: quality selection is not available on iOS */}
              <VideoQualityMenu />

              <SourceMenu />

              <FullscreenButton />
            </View>
          </View>
        </View>
      </PlayerContext.Provider>
    );
  }
}
