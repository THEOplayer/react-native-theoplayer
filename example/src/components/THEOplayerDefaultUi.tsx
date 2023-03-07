import React, { ReactNode, useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { SeekBar, THUMBNAIL_MODE } from './seekbar/SeekBar';
import { AirplayButton } from './button/AirplayButton';
import { ChromecastButton, ENABLE_CAST_BUTTON } from './button/ChromecastButton';
import { ControlBar } from './controlbar/ControlBar';
import { TimeLabel } from './timelabel/TimeLabel';
import { FullscreenButton } from './button/FullscreenButton';
import { LanguageMenuButton } from './menu/LanguageMenuButton';
import { SettingsMenuButton } from './menu/SettingsMenuButton';
import { MuteButton } from './button/MuteButton';
import { CastMessage } from './message/CastMessage';
import { CenteredDelayedActivityIndicator } from './activityindicator/CenteredDelayedActivityIndicator';
import { CENTER_BUTTON_SIZE, defaultPlayerStyle, THEOplayerStyle } from './THEOplayerStyle';
import { StyleSheet, View } from 'react-native';
import { UiContainer } from './uicontroller/UiContainer';
import { SourceMenuButton } from './menu/SourceMenuButton';
import { PlayButton } from './button/PlayButton';

export interface THEOplayerDefaultUiProps {
  style?: Partial<THEOplayerStyle>;
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
              {ENABLE_CAST_BUTTON && (
                <>
                  <AirplayButton />
                  <ChromecastButton />
                </>
              )}
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
              <ControlBar>
                <CastMessage />
                <View style={{ flexGrow: 1 }} />
              </ControlBar>
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
          }></UiContainer>
      )}
    </View>
  );
}
