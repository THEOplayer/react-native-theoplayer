import React, { ReactNode, useState } from 'react';
import { FULLSCREEN_CENTER_STYLE, PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { SeekBar } from './components/seekbar/SeekBar';
import { AirplayButton } from './components/button/AirplayButton';
import { CenteredControlBar, ControlBar } from './components/controlbar/ControlBar';
import { TimeLabel } from './components/timelabel/TimeLabel';
import { FullscreenButton } from './components/button/FullscreenButton';
import { LanguageMenuButton } from './components/menu/LanguageMenuButton';
import { MuteButton } from './components/button/MuteButton';
import { CastMessage } from './components/message/CastMessage';
import { DEFAULT_THEOPLAYER_THEME, THEOplayerTheme } from './THEOplayerTheme';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import { UiContainer } from './components/uicontroller/UiContainer';
import { PlayButton } from './components/button/PlayButton';
import { SkipButton } from './components/button/SkipButton';
import { Spacer } from './components/controlbar/Spacer';
import { ChromecastButton } from './components/button/ChromecastButton';
import { CenteredDelayedActivityIndicator } from './components/activityindicator/CenteredDelayedActivityIndicator';

export interface THEOplayerDefaultUiProps {
  /**
   * The style for the container.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The theme for all components.
   */
  theme?: Partial<THEOplayerTheme>;
  /**
   * The player configuration with THEOplayer license.
   */
  config?: PlayerConfiguration;
  /**
   * The callback that is called when the internal THEOplayer is created.
   * @param player the internal THEOplayer
   */
  onPlayerReady?: (player: THEOplayer) => void;
  /**
   * A slot in the top right to add additional UI components.
   */
  topSlot?: ReactNode;
  /**
   * A slot in the bottom right to add additional UI components.
   */
  bottomSlot?: ReactNode;
}

/**
 * A default UI layout which uses UI components from `react-native-theoplayer` to create a basic playback UI around a THEOplayerView.
 */
export function THEOplayerDefaultUi(props: THEOplayerDefaultUiProps) {
  const { theme, config, topSlot, bottomSlot, style } = props;
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const chromeless = config?.chromeless ?? false;

  const onPlayerReady = (player: THEOplayer) => {
    setPlayer(player);
    props.onPlayerReady?.(player);
  };

  return (
    <View style={style}>
      <View style={[FULLSCREEN_CENTER_STYLE, { backgroundColor: '#000000' }]} />
      <THEOplayerView config={config} onPlayerReady={onPlayerReady}>
        {player !== undefined && chromeless && (
          <UiContainer
            theme={{ ...DEFAULT_THEOPLAYER_THEME, ...theme }}
            player={player}
            behind={<CenteredDelayedActivityIndicator size={50} />}
            top={
              <ControlBar>
                {topSlot}
                {!Platform.isTV && (
                  <>
                    <AirplayButton />
                    <ChromecastButton />
                  </>
                )}
                <LanguageMenuButton />
              </ControlBar>
            }
            center={<CenteredControlBar left={<SkipButton skip={-10} />} middle={<PlayButton />} right={<SkipButton skip={30} />} />}
            bottom={
              <>
                <ControlBar style={{ justifyContent: 'flex-start' }}>
                  <CastMessage />
                </ControlBar>
                <ControlBar>
                  <SeekBar />
                </ControlBar>

                <ControlBar>
                  <MuteButton />
                  <TimeLabel showDuration={true} />

                  <Spacer />

                  {bottomSlot}
                  <FullscreenButton />
                </ControlBar>
              </>
            }
          />
        )}
      </THEOplayerView>
    </View>
  );
}
