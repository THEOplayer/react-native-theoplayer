import React, { PureComponent } from 'react';
import { PlayerEventType } from 'react-native-theoplayer';
import { SeekBar } from '../seekbar/SeekBar';
import styles from './VideoPlayerUI.style';
import { THUMBNAIL_MODE, VideoPlayerUIProps } from './VideoPlayerUIProps';
import { AirplayButton } from '../button/AirplayButton';
import { ChromecastButton } from '../button/ChromecastButton';
import { ControlBar, SplitControlBar } from '../controlbar/ControlBar';
import { TimeLabel } from '../timelabel/TimeLabel';
import { FullscreenButton } from '../button/FullscreenButton';
import { TextTrackMenu } from '../menu/TextTrackMenu';
import { AudioTrackMenu } from '../menu/AudioTrackMenu';
import { VideoQualityMenu } from '../menu/VideoQualityMenu';
import { SourceMenu } from '../menu/SourceMenu';
import { MuteButton } from '../button/MuteButton';
import { PlayerContext } from '../util/Context';
import { SlotView } from '../slots/SlotView';
import { PlayButton } from '../button/PlayButton';
import { BigPlayButton } from '../button/BigPlayButton';
import { CastMessage } from '../view/CastMessage';
import { CenteredDelayedActivityIndicator } from '../delayedactivityindicator/CenteredDelayedActivityIndicator';
import { ErrorDisplay } from '../view/ErrorDisplay';

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
        <SlotView
          style={style}
          top={
            <ControlBar>
              <AirplayButton />
              <ChromecastButton />
            </ControlBar>
          }
          center={
            <>
              <BigPlayButton />
              <CenteredDelayedActivityIndicator />
            </>
          }
          bottom={
            <>
              <CastMessage />
              <ControlBar>
                <SeekBar thumbnailMode={THUMBNAIL_MODE} />
              </ControlBar>

              <SplitControlBar
                left={
                  <>
                    <PlayButton />
                    <MuteButton />
                    <TimeLabel showDuration={true} style={styles.timeLabel} />
                  </>
                }
                right={
                  <>
                    <TextTrackMenu />
                    <AudioTrackMenu />
                    {/*Note: quality selection is not available on iOS */}
                    <VideoQualityMenu />
                    <SourceMenu />
                    <FullscreenButton />
                  </>
                }
              />
            </>
          }>
          <ErrorDisplay />
        </SlotView>
      </PlayerContext.Provider>
    );
  }
}
