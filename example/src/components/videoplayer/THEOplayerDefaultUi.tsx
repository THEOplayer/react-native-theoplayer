import React, { ReactNode, useState } from 'react';
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
import { CastMessage } from '../view/CastMessage';
import { CenteredDelayedActivityIndicator } from '../delayedactivityindicator/CenteredDelayedActivityIndicator';
import { ErrorDisplay } from '../view/ErrorDisplay';
import { CENTER_BUTTON_SIZE, defaultPlayerStyle, VideoPlayerStyle } from '../style/VideoPlayerStyle';
import { StyleSheet, View } from 'react-native';
import { UiContainer } from '../uicontroller/UiContainer';
import { SourceMenuButton } from '../menu/SourceMenuButton';
import { PlayButton } from '../button/PlayButton';

export interface THEOplayerDefaultUiProps {
  style?: Partial<VideoPlayerStyle>;
  config?: PlayerConfiguration;
  onPlayerReady?: (player: THEOplayer) => void;
  topSlot?: ReactNode;
  bottomSlot?: ReactNode;
}

export function THEOplayerDefaultUi(props: THEOplayerDefaultUiProps) {
  const { style, config, topSlot, bottomSlot } = props;
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
              {topSlot}
              <AirplayButton />
              <ChromecastButton />
            </ControlBar>
          }
          center={
            <ControlBar style={{ height: CENTER_BUTTON_SIZE }}>
              <PlayButton style={{ height: CENTER_BUTTON_SIZE, width: CENTER_BUTTON_SIZE }} />
              <CenteredDelayedActivityIndicator />
            </ControlBar>
          }
          bottom={
            <>
              <CastMessage />
              <ControlBar>
                <SeekBar thumbnailMode={THUMBNAIL_MODE} />
              </ControlBar>

              <ControlBar>
                <MuteButton />
                <TimeLabel showDuration={true} />

                {/*Spacer*/}
                <View style={{ flexGrow: 1 }} />

                {bottomSlot}
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
