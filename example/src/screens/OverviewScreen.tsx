import * as React from 'react';
import { Button, View, Text } from 'react-native';

function OverviewScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Samples Overview</Text>
      <Button
        title="Minimal Setup"
        onPress={() => navigation.navigate('Sample_Minimal')}
        color="white"
      />
      <Button
        title="Extended Setup"
        onPress={() => navigation.navigate('Sample_Extended')}
        color="white"
      />
    </View>
  );
}

export default OverviewScreen;
