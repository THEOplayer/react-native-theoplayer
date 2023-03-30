import * as React from 'react';
import { PlayerConfiguration, PlayerEventType, THEOplayer, THEOplayerDefaultUi, PipButton } from 'react-native-theoplayer';
import { StyleSheet, View } from 'react-native';
import { SourceMenuButton, SOURCES } from './custom/SourceMenuButton';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  // Without a license, only demo sources hosted on '*.theoplayer.com' domains can be played.
  license: undefined,
  chromeless: true,
  libraryLocation: 'theoplayer',
  cast: {
    chromecast: {
      appID: 'CC1AD845',
    },
    strategy: 'auto',
  },
  mediaControl: {
    mediaSessionEnabled: true,
  },
};

export default function App() {
  const onPlayerReady = (player: THEOplayer) => {
    // optional debug logs
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

    player.source = SOURCES[0].source;
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <THEOplayerDefaultUi config={playerConfig} onPlayerReady={onPlayerReady} topSlot={<SourceMenuButton />} bottomSlot={<PipButton />} />
    </View>
  );
}
