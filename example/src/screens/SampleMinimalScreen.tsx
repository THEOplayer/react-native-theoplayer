import * as React from 'react';
import { useState } from 'react';
import {
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  ControlBar,
  DEFAULT_THEOPLAYER_THEME,
  MuteButton,
  PlayButton,
  SeekBar,
  SkipButton,
  TimeLabel,
  UiContainer,
} from '@theoplayer/react-native-ui';
import { PlayerConfiguration, PlayerEventType, THEOplayer, THEOplayerView } from 'react-native-theoplayer';

import { Platform, SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SourceMenuButton, SOURCES } from '../custom/SourceMenuButton';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  // Without a license, only demo sources hosted on '*.theoplayer.com' domains can be played.
  libraryLocation: 'theoplayer',
};

export default function SampleMinimalScreen() {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const onPlayerReady = (player: THEOplayer) => {
    setPlayer(player);

    // optional debug logs
    player.addEventListener<PlayerEventType>(PlayerEventType.SOURCE_CHANGE, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.LOADED_DATA, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.LOADED_METADATA, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.READYSTATE_CHANGE, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.PLAY, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.PLAYING, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.PAUSE, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.SEEKING, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.SEEKED, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.ENDED, console.log);
    player.source = SOURCES[0].source;

    console.log('THEOplayer is ready:', player.version);
  };

  const PLAYER_CONTAINER_STYLE: ViewStyle = {
    position: 'absolute',
    top: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
      <View style={PLAYER_CONTAINER_STYLE}>
        <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
          {player !== undefined && (
            <UiContainer
              theme={{ ...DEFAULT_THEOPLAYER_THEME }}
              player={player}
              behind={<CenteredDelayedActivityIndicator size={50} />}
              top={
                <ControlBar>
                  <SourceMenuButton />
                </ControlBar>
              }
              center={<CenteredControlBar left={<SkipButton skip={-10} />} middle={<PlayButton />} right={<SkipButton skip={30} />} />}
              bottom={
                <>
                  {
                    /*Note: RNSlider is not available on tvOS */
                    !(Platform.isTV && Platform.OS === 'ios') && (
                      <ControlBar>
                        <SeekBar />
                      </ControlBar>
                    )
                  }
                  <ControlBar>
                    <MuteButton />
                    <TimeLabel showDuration={true} />
                  </ControlBar>
                </>
              }
            />
          )}
        </THEOplayerView>
      </View>
    </SafeAreaView>
  );
}
