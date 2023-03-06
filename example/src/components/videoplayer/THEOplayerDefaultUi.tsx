import React, { useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { SeekBar } from '../seekbar/SeekBar';
import { THUMBNAIL_MODE } from './VideoPlayerUIProps';
import { AirplayButton } from '../button/AirplayButton';
import { ChromecastButton } from '../button/ChromecastButton';
import { ControlBar } from '../controlbar/ControlBar';
import { TimeLabel } from '../timelabel/TimeLabel';
import { FullscreenButton } from '../button/FullscreenButton';
import { LanguageMenuButton } from '../menu/LanguageMenuButton';
import { SettingsMenuButton } from '../menu/SettingsMenuButton';
import { MuteButton } from '../button/MuteButton';
import { BigPlayButton } from '../button/BigPlayButton';
import { CastMessage } from '../view/CastMessage';
import { CenteredDelayedActivityIndicator } from '../delayedactivityindicator/CenteredDelayedActivityIndicator';
import { ErrorDisplay } from '../view/ErrorDisplay';
import { defaultPlayerStyle, VideoPlayerStyle } from '../style/VideoPlayerStyle';
import { StyleSheet, View } from 'react-native';
import { UiContainer } from '../uicontroller/UiContainer';
import { SourceMenuButton } from '../menu/SourceMenuButton';

export interface THEOplayerDefaultUiProps {
  style?: Partial<VideoPlayerStyle>;
  config?: PlayerConfiguration;
  onPlayerReady?: (player: THEOplayer) => void;
}

export function THEOplayerDefaultUi(props: THEOplayerDefaultUiProps) {
  const { style, config } = props;
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const chromeless = config?.chromeless ?? false;

  const onPlayerReady = (player: THEOplayer) => {
    setPlayer(player);
    props.onPlayerReady?.(player);
  };

  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <THEOplayerView config={config} style={StyleSheet.absoluteFill} onPlayerReady={onPlayerReady} />
      {player !== undefined && chromeless && (
        <UiContainer
          style={{ ...defaultPlayerStyle, ...style }}
          player={player}
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

              <ControlBar>
                <MuteButton />
                <TimeLabel showDuration={true} style={defaultPlayerStyle.videoPlayer.timeLabelContainer} />

                {/*Spacer*/}
                <View style={{ flexGrow: 1 }} />

                <LanguageMenuButton />
                {/*Note: quality selection is not available on iOS */}
                <SettingsMenuButton />
                <SourceMenuButton />
                <FullscreenButton />
              </ControlBar>
            </>
          }>
          <ErrorDisplay />
        </UiContainer>
      )}
    </View>
  );
}
