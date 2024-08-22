import * as React from 'react';
import { Button, View, Platform } from 'react-native';
import PropTypes from 'prop-types';

const c = Platform.OS === 'ios' ? 'white' : 'transparent';
export const OverviewScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, margin: 25 }}>
      <Button title="Minimal Setup" onPress={() => navigation.navigate('Sample_Minimal')} color={c} />
      <Button title="Extended Setup" onPress={() => navigation.navigate('Sample_Extended')} color={c} />
      <Button title="PresentationModes" onPress={() => navigation.navigate('Sample_PresentationModes')} color={c} />
      <Button title="DRM" onPress={() => navigation.navigate('Sample_DRM')} color={c} />
      <Button title="Sideloaded TextTrack" onPress={() => navigation.navigate('Sample_SideloadedTextTrack')} color={c} />
      <Button title="Flashlist" onPress={() => navigation.navigate('Sample_Flashlist')} color={c} />
      <Button title="Analytics: Conviva" onPress={() => navigation.navigate('Sample_Conviva')} color={c} />
      <Button title="Analytics: Comscore" onPress={() => navigation.navigate('Sample_Comscore')} color={c} />
      <Button title="Analytics: Nielsen" onPress={() => navigation.navigate('Sample_Nielsen')} color={c} />
      <Button title="Analytics: Adobe" onPress={() => navigation.navigate('Sample_Adobe')} color={c} />
      <Button title="Analytics: Mux" onPress={() => navigation.navigate('Sample_Mux')} color={c} />
    </View>
  );
};

OverviewScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
