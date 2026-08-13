import React, { Component } from 'react';
import { Tester, TestHookStore } from 'react-native-cavynext';
import { Platform, SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import { TestableTHEOplayerView } from './components/TestableTHEOplayerView';
import Specs from './tests';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { PlayerConfiguration, PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { Log } from './utils/Log';

const testHookStore = new TestHookStore();
// Debug simulators need extra time for cold-start native player creation.
const TESTER_WAIT_TIME = 30_000;

const playerConfig: PlayerConfiguration = {
  // On web, THEOplayer needs to know where the transmux workers were copied to.
  libraryLocation: Platform.OS === 'web' ? 'theoplayer' : undefined,
  // Browsers block unmuted autoplay without a user gesture; fall back to
  // muted autoplay so the autoplay tests can run.
  mutedAutoplay: Platform.OS === 'web' ? 'all' : undefined,
};

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

// Deliberately not wrapped in <StrictMode>: its double-invoked mounts create
// and destroy a second native player per test, which duplicates every log line
// and races the player under test.
export class TestableApp extends Component {
  player: THEOplayer | undefined = undefined;

  onPlayerReady = (player: THEOplayer) => {
    Log.log('[TestableApp] Player is ready.');
    this.player = player;

    for (const type of [PlayerEventType.PLAY, PlayerEventType.PLAYING, PlayerEventType.PAUSE] as const) {
      this.player.addEventListener(type, () => {
        Log.log(`[TestableApp] Player event: ${type} (paused: ${player.paused})`);
      });
    }
  };

  onPlayerDestroy = (_player: THEOplayer) => {
    Log.log('[TestableApp] Player is destroyed.');
    this.player = undefined;
  };

  render() {
    return (
      <Tester specs={Specs} store={testHookStore} waitTime={TESTER_WAIT_TIME}>
        <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
          <View style={PLAYER_CONTAINER_STYLE}>
            <TestableTHEOplayerView config={playerConfig} onPlayerReady={this.onPlayerReady} onPlayerDestroy={this.onPlayerDestroy} />
          </View>
        </SafeAreaView>
      </Tester>
    );
  }
}
