import React, { ReactNode, useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { SeekBar } from './components/seekbar/SeekBar';
import { AirplayButton } from './components/button/AirplayButton';
import { CenteredControlBar, ControlBar } from './components/controlbar/ControlBar';
import { TimeLabel } from './components/timelabel/TimeLabel';
import { FullscreenButton } from './components/button/FullscreenButton';
import { LanguageMenuButton } from './components/menu/LanguageMenuButton';
import { SettingsMenuButton } from './components/menu/SettingsMenuButton';
import { MuteButton } from './components/button/MuteButton';
import { CastMessage } from './components/message/CastMessage';
import { DEFAULT_THEOPLAYER_THEME, THEOplayerTheme } from './THEOplayerTheme';
import { Platform, View } from 'react-native';
import { UiContainer } from './components/uicontroller/UiContainer';
import { PlayButton } from './components/button/PlayButton';
import { QualitySubMenu } from './components/menu/QualitySubMenu';
import { PlaybackRateSubMenu } from './components/menu/PlaybackRateSubMenu';
import { SkipButton } from './components/button/SkipButton';
import { Spacer } from './components/controlbar/Spacer';
import { ChromecastButton } from './components/button/ChromecastButton';
import { CenteredDelayedActivityIndicator } from './components/activityindicator/CenteredDelayedActivityIndicator';

export interface THEOplayerDefaultUiProps {
  theme?: Partial<THEOplayerTheme>;
  config?: PlayerConfiguration;
  onPlayerReady?: (player: THEOplayer) => void;
  topSlot?: ReactNode;
  bottomSlot?: ReactNode;
}

const ENABLE_CAST_BUTTON = !Platform.isTV;

export function THEOplayerDefaultUi(props: THEOplayerDefaultUiProps) {
  const { theme, config, topSlot, bottomSlot } = props;
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const chromeless = config?.chromeless ?? false;

  const onPlayerReady = (player: THEOplayer) => {
    setPlayer(player);
    props.onPlayerReady?.(player);
  };

  return (
    <THEOplayerView config={config} onPlayerReady={onPlayerReady}>
      {player !== undefined && chromeless && (
        <UiContainer
          theme={{ ...DEFAULT_THEOPLAYER_THEME, ...theme }}
          player={player}
          behind={<CenteredDelayedActivityIndicator size={50} />}
          top={
            <ControlBar>
              {topSlot}
              {ENABLE_CAST_BUTTON && (
                <>
                  <AirplayButton />
                  <ChromecastButton />
                </>
              )}
              <LanguageMenuButton />
              <SettingsMenuButton>
                {/*Note: quality selection is not available on iOS */}
                <QualitySubMenu />
                <PlaybackRateSubMenu />
              </SettingsMenuButton>
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
  );
}
