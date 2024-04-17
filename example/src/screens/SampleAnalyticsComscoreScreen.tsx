import * as React from 'react';
import { useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {
  ComscoreMediaType,
  ComscoreMetadata,
  useComscore
} from "@theoplayer/react-native-analytics-comscore";
import {COMSCORE_CONFIG, COMSCORE_PUBLISHER_ID, THEO_LICENSE} from "../sampleConfig";

const LOG_TAG = "[EXAMPLE - ANALYTICS COMSCORE SAMPLE]";
const playerConfig: PlayerConfiguration = {
  license: THEO_LICENSE,
  libraryLocation: 'theoplayer',
};

const comscoreMetadata: ComscoreMetadata = {
  mediaType: ComscoreMediaType.longFormOnDemand,
  uniqueId: "testuniqueId",
  length: 634.566,
  stationTitle: "THEOTV",
  programTitle: "Big Buck Bunny",
  episodeTitle: "Intro",
  genreName: "Animation",
  classifyAsAudioStream: false,
  customLabels: {
    "testcustomlabel": "testcustomvalue"
  }
};

export const SampleAnalyticsComscoreScreen = () => {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [_, initComscore] = useComscore(comscoreMetadata, COMSCORE_CONFIG);

  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);
    setPlayer(player);

    // initialize Comscore connector, by passing player instance
    if (COMSCORE_PUBLISHER_ID === '<YOUR_PUBLISHER_ID>') {
      console.warn(LOG_TAG, 'Setup a correct configuration to activate Comscore analytics support.');
    } else {
      initComscore(player);
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
