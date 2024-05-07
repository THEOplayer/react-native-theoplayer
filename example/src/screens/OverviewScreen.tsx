import * as React from 'react';
import { Button, View, Text, Platform } from 'react-native';
import PropTypes from 'prop-types';

const c = Platform.OS === 'ios' ? 'white' : 'black';
export const OverviewScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Samples Overview</Text>
      <Button title="Minimal Setup" onPress={() => navigation.navigate('Sample_Minimal')} color={c} />
      <Button title="Extended Setup" onPress={() => navigation.navigate('Sample_Extended')} color={c} />
      <Button title="PresentationModes" onPress={() => navigation.navigate('Sample_PresentationModes')} color={c} />
      <Button title="DRM" onPress={() => navigation.navigate('Sample_DRM')} color={c} />
      <Button title="Sideloaded TextTrack" onPress={() => navigation.navigate('Sample_SideloadedTextTrack')} color={c} />
      <Button title="Analytics: Conviva" onPress={() => navigation.navigate('Sample_Conviva')} color={c} />
      <Button title="Analytics: Comscore" onPress={() => navigation.navigate('Sample_Comscore')} color={c} />
      <Button title="Analytics: Nielsen" onPress={() => navigation.navigate('Sample_Nielsen')} color={c} />
      <Button title="Analytics: Adobe" onPress={() => navigation.navigate('Sample_Adobe')} color={c} />
    </View>
  );
};

OverviewScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
