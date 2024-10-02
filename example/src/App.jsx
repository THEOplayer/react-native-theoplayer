import * as React from 'react';
import { View } from 'react-native';
import { AppWithPlayer, PlayerComponent } from './Player';

import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export default function App() {
  const [playerVisible, setPlayerVisible] = React.useState(false);
  const [theo, setTheo] = React.useState(null);
  return (
    <NavigationContainer ref={navigationRef}>
      <View style={{ width: '100%', height: '100%' }}>
        <AppWithPlayer setPlayerVisible={setPlayerVisible} theo={theo} />
        <PlayerComponent playerVisible={playerVisible} setTheo={setTheo} />
      </View>
    </NavigationContainer>
  );
}
