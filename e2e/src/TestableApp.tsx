import React, { Component } from 'react';
import { Tester, TestHookStore } from 'cavy';
import { Platform, SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import { TestableTHEOplayerView } from './components/TestableTHEOplayerView';
import Specs from './tests';
import { getStatusBarHeight } from 'react-native-status-bar-height';

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
  render() {
    return (
      <Tester specs={Specs} store={testHookStore}>
        <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
          <View style={PLAYER_CONTAINER_STYLE}>
            <TestableTHEOplayerView />
          </View>
        </SafeAreaView>
      </Tester>
    );
  }
}
