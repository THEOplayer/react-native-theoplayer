import * as React from 'react';
import { useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { usePlayerFocus } from "../hooks/usePlayerFocus";
import { useConviva, ConvivaMetadata } from "@theoplayer/react-native-analytics-conviva";
import {CONVIVA_CONFIG, CONVIVA_CUSTOMER_KEY, THEO_LICENSE} from "../sampleConfig";

const LOG_TAG = "[EXAMPLE - ANALYTICS CONVIVA SAMPLE]";
const playerConfig: PlayerConfiguration = {
  license: THEO_LICENSE,
  libraryLocation: 'theoplayer',
};

const convivaMetadata: ConvivaMetadata = {
  ['Conviva.applicationName']: 'THEOplayer',
  ['Conviva.viewerId']: 'your_viewer_id',
  ['customTag1']: "customValue1",
};

export const SampleAnalyticsConvivaScreen = () => {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [_, initConviva] = useConviva(convivaMetadata, CONVIVA_CONFIG);

  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);
    setPlayer(player);

    // initialize Comscore connector, by passing player instance
    if (CONVIVA_CUSTOMER_KEY === '<YOUR_CUSTOMER_KEY>') {
      console.warn(LOG_TAG, 'Setup a correct configuration to activate Conviva analytics support.');
    } else {
      initConviva(player);
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

  // example app specific setup
  usePlayerFocus(player);

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
