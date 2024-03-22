import * as React from 'react';
import { Button, View, Text } from 'react-native';

function SamplesScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Samples Screen</Text>
      <Button
        title="Minimal Setup"
        onPress={() => navigation.navigate('Sample_Minimal')}
      />
      <Button
        title="Full Featured Setup"
        onPress={() => navigation.navigate('Sample_FullFeatured')}
      />
    </View>
  );
}

export default SamplesScreen;
