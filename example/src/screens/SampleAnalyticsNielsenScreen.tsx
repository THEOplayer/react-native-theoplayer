import * as React from 'react';
import { useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {useNielsen} from "@theoplayer/react-native-analytics-nielsen";
import {NIELSEN_APP_ID, NIELSEN_OPTIONS, THEO_LICENSE} from "../sampleConfig";

const LOG_TAG = "[EXAMPLE - ANALYTICS NIELSEN SAMPLE]";
const playerConfig: PlayerConfiguration = {
  license: THEO_LICENSE,
  libraryLocation: 'theoplayer',
};

export const SampleAnalyticsNielsenScreen = () => {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [, initNielsen] = useNielsen(NIELSEN_APP_ID, 'THEOplayer demo', NIELSEN_OPTIONS);

  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);
    setPlayer(player);

    // initialize Comscore connector, by passing player instance
    if (NIELSEN_APP_ID === '<YOUR_NIELSEN_APP_ID>') {
      console.warn(LOG_TAG, 'Setup a correct configuration to activate Nielsen analytics support.');
    } else {
      initNielsen(player);
    }

    // set a source
    player.source = {
      sources: [
        {
          "src": "https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8",
          "type": "application/x-mpegurl"
        }
      ],
      metadata: {
        title: "My metadata title"
      }
    };

    // start playing
    player.play();
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
      <View style={styles.PLAYER_CONTAINER_STYLE}>
        <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  PLAYER_CONTAINER_STYLE: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
});
