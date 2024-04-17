import * as React from 'react';
import { useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useAdobe } from "@theoplayer/react-native-analytics-adobe";
import { THEO_LICENSE, ADOBE_ECID, ADOBE_SID, ADOBE_TRACKING_URL, ADOBE_URI} from "../sampleConfig";

const LOG_TAG = "[EXAMPLE - ANALYTICS ADOBE SAMPLE]";
const playerConfig: PlayerConfiguration = {
  license: THEO_LICENSE,
  libraryLocation: 'theoplayer',
};

export const SampleAnalyticsAdobeScreen = () => {
  const [, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [, initAdobe] = useAdobe(ADOBE_URI, ADOBE_ECID, ADOBE_SID, ADOBE_TRACKING_URL);

  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);
    setPlayer(player);

    // initialize adobe connector, by passing player instance
    if (ADOBE_URI === '<YOUR_ADOBE_URI>') {
      console.warn(LOG_TAG, 'Setup a correct configuration to activate Adobe analytics support.');
    } else {
      initAdobe(player);
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
