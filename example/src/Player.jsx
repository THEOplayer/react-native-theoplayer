/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import * as React from 'react';
import { Pressable, View, Text } from 'react-native';
import { PortalDestination } from '@alexzunik/rn-native-portals-reborn';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AVPlayer from './AVPlayer';

// eslint-disable-next-line react/prop-types
export const PlayerComponent = ({ playerVisible, setTheo }) => {
  // @ts-ignore
  return <AVPlayer playerVisible={playerVisible} setTheo={setTheo} />;
};

// eslint-disable-next-line react/prop-types
export const Home = ({ setPlayerVisible }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: 'blue',
        backgroundColor: 'red',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}>
      <Pressable
        style={{ height: 50, width: 100, borderWidth: 1, borderColor: 'black' }}
        onPress={() => {
          console.log('on Press');
          navigation.navigate('player');
          setPlayerVisible(true);
        }}>
        <Text>Test</Text>
      </Pressable>
    </View>
  );
};

export const PlayerScreen = ({ theo, setPlayerVisible }) => {
  console.log('Render');
  const navigation = useNavigation();
  return (
    <View style={{ width: '100%', height: '100%' }}>
      <View style={{ height: 400, width: '99%', backgroundColor: 'blue' }}>
        <PortalDestination name="fullscreenplayer" />
      </View>
      <Pressable
        style={{ height: 50, width: 100 }}
        onPress={() => {
          setPlayerVisible(false);
          navigation.navigate('home');
        }}>
        <Text>Dismiss</Text>
      </Pressable>
      <Pressable
        style={{ height: 50, width: 100 }}
        onPress={() => {
          theo.play();
        }}>
        <Text>Play</Text>
      </Pressable>
    </View>
  );
};

const Stack = createNativeStackNavigator();

// eslint-disable-next-line react/prop-types
export const AppWithPlayer = ({ setPlayerVisible, theo }) => {
  return (
    <Stack.Navigator initialRouteName={'test'}>
      <Stack.Screen name={'home'} children={() => <Home setPlayerVisible={setPlayerVisible} />} />
      <Stack.Group
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}>
        <Stack.Screen name={'player'} children={() => <PlayerScreen setPlayerVisible={setPlayerVisible} theo={theo} />} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
