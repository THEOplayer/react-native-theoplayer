import React, { ReactNode, useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { SeekBar } from './seekbar/SeekBar';
import { AirplayButton } from './button/AirplayButton';
import { CenteredControlBar, ControlBar } from './controlbar/ControlBar';
import { TimeLabel } from './timelabel/TimeLabel';
import { FullscreenButton } from './button/FullscreenButton';
import { LanguageMenuButton } from './menu/LanguageMenuButton';
import { SettingsMenuButton } from './menu/SettingsMenuButton';
import { MuteButton } from './button/MuteButton';
import { CastMessage } from './message/CastMessage';
import { defaultTheme, THEOplayerTheme } from './THEOplayerTheme';
import { Platform, View } from 'react-native';
import { UiContainer } from './uicontroller/UiContainer';
import { PlayButton } from './button/PlayButton';
import { QualitySubMenu } from './menu/QualitySubMenu';
import { PlaybackRateSubMenu } from './menu/PlaybackRateSubMenu';
import { SkipButton } from './button/SkipButton';
import { Spacer } from './controlbar/Spacer';
import { ChromecastButton } from './button/ChromecastButton';
import { CenteredDelayedActivityIndicator } from './activityindicator/CenteredDelayedActivityIndicator';

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
          theme={{ ...defaultTheme, ...theme }}
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
              <ControlBar>
                <CastMessage />
                <View style={{ flexGrow: 1 }} />
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
