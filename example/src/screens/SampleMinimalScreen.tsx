import * as React from 'react';
import { useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';

import { Platform, SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {usePlayerFocus} from "../hooks/usePlayerFocus";

const LOG_TAG = "[EXAMPLE - MINIMAL SAMPLE]";

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  // Without a license, only demo sources hosted on '*.theoplayer.com' domains can be played.
  license: undefined,
  libraryLocation: 'theoplayer',
};

export default function SampleMinimalScreen() {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);
    setPlayer(player);

    // set a source
    player.source = {
      sources: [
        {
          "src": "https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8",
          "type": "application/x-mpegurl"
        }
      ]
    };

    // start playing
    player.play();
  };

  // example app specific setup
  usePlayerFocus(player);

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
        <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady} />
      </View>
    </SafeAreaView>
  );
}
