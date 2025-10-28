import React, { Component } from 'react';
import { Tester, TestHookStore } from 'cavy';
import { Platform, SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import { TestableTHEOplayerView } from './components/TestableTHEOplayerView';
import Specs from './tests';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { Log } from './utils/Log';

const testHookStore = new TestHookStore();

const needsBorder = Platform.OS === 'ios';
const PLAYER_CONTAINER_STYLE: ViewStyle = {
  position: 'absolute',
  top: needsBorder ? getStatusBarHeight() : 0,
  left: needsBorder ? 2 : 0,
  bottom: 0,
  right: needsBorder ? 2 : 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#000000',
};

export class TestableApp extends Component {
  player: THEOplayer | undefined = undefined;

  onPlayerReady(player: THEOplayer) {
    Log.log('[TestableApp] Player is ready.');
    this.player = player;

    this.player.addEventListener(PlayerEventType.PLAY, () => {
      Log.log('[TestableApp] Player event: PLAY');
    });
    this.player.addEventListener(PlayerEventType.PLAYING, () => {
      Log.log('[TestableApp] Player event: PLAYING');
    });
  }
  onPlayerDestroy(_player: THEOplayer) {
    Log.log('[TestableApp] Player is destroyed.');
    this.player = undefined;
  }

  render() {
    return (
      <Tester specs={Specs} store={testHookStore}>
        <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
          <View style={PLAYER_CONTAINER_STYLE}>
            <TestableTHEOplayerView onPlayerReady={this.onPlayerReady} onPlayerDestroy={this.onPlayerDestroy} />
          </View>
        </SafeAreaView>
      </Tester>
    );
  }
}
