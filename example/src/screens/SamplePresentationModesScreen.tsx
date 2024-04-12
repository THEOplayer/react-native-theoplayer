import * as React from 'react';
import {useState} from 'react';
import { Text } from 'react-native';
import {
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  ControlBar,
  DEFAULT_THEOPLAYER_THEME,
  FullscreenButton,
  PipButton,
  PlayButton,
  SeekBar,
  SettingsMenuButton,
  SkipButton,
  Spacer,
  TimeLabel,
  UiContainer,
} from '@theoplayer/react-native-ui';
import {
  PlayerConfiguration,
  PlayerEventType, PresentationMode, PresentationModeChangeEvent,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';

import {Platform, SafeAreaView, StyleSheet, View} from 'react-native';
import {SourceMenuButton, SOURCES} from '../custom/SourceMenuButton';
import {PiPSubMenu} from '../custom/PipSubMenu';
import {usePlayerFocus} from "../hooks/usePlayerFocus";

const LOG_TAG = "[EXAMPLE - PRESENTATIONMODES SAMPLE]";

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  // Without a license, only demo sources hosted on '*.theoplayer.com' domains can be played.
  license: undefined,
  libraryLocation: 'theoplayer',
};

export const SamplePresentationModesScreen = () => {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [activePresentationMode, setActivePresentationMode] = useState<PresentationMode>(PresentationMode.inline
  );
  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);

    // store player reference
    setPlayer(player);

    // setup debug logs
    player.addEventListener<PlayerEventType>(PlayerEventType.PRESENTATIONMODE_CHANGE, (e: PresentationModeChangeEvent) => {
      console.log(LOG_TAG, `Player transitioned from ${e.previousPresentationMode} to ${e.presentationMode}.`);
      setActivePresentationMode(e.presentationMode);
    });

    // configure autoplay
    player.autoplay = true;

    // set initial source
    player.source = SOURCES[0].source;

    // configure PiP
    player.pipConfiguration = { startsAutomatically: true };
  };

  // example app specific setup
  usePlayerFocus(player);

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
      <Text style={styles.TEXT}>{`Active presentationMode: ${activePresentationMode}`}</Text>
      <View style={styles.PLAYER_CONTAINER_STYLE}>
        <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
          {player !== undefined  && (
            <UiContainer
              theme={{ ...DEFAULT_THEOPLAYER_THEME }}
              player={player}
              behind={<CenteredDelayedActivityIndicator size={50} />}
              top={
                <ControlBar>
                  {/*This is a custom menu for source selection.*/}
                  <SourceMenuButton />
                  <SettingsMenuButton>
                    <PiPSubMenu />
                  </SettingsMenuButton>
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
                    <TimeLabel showDuration={true} />
                    <Spacer />
                    <PipButton />
                    <FullscreenButton />
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

const styles = StyleSheet.create({
  PLAYER_CONTAINER_STYLE: {
    position: 'absolute',
    top: "25%",
    left: "20%",
    bottom: "25%",
    right: "20%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  TEXT: {
    marginTop: 25,
    marginHorizontal: 20,
    color: "white",
    textAlign: 'center'
  }
});
