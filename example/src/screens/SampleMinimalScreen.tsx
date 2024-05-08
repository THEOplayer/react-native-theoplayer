import * as React from 'react';
import { useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { SafeAreaView, StyleSheet } from 'react-native';
import { THEO_LICENSE } from '../sampleConfig';
import { SOURCES } from '../custom/SourceMenuButton';

const LOG_TAG = '[EXAMPLE - MINIMAL SAMPLE]';
const playerConfig: PlayerConfiguration = {
  license: THEO_LICENSE,
  libraryLocation: 'theoplayer',
};

export const SampleMinimalScreen = () => {
  const [, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);

    // store player reference
    setPlayer(player);

    // set a source
    player.source = SOURCES[0].source;

    // start playing
    player.play();
  };

  return (
    <SafeAreaView style={styles.PLAYER_CONTAINER_STYLE}>
      <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  PLAYER_CONTAINER_STYLE: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
