import * as React from 'react';
import { Button, View, Text } from 'react-native';
import PropTypes from 'prop-types';

export const OverviewScreen = ({ navigation }) => {
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
      <Button
        title="PresentationModes Setup"
        onPress={() => navigation.navigate('Sample_PresentationModes')}
        color="white"
      />
      <Button
        title="DRM Setup"
        onPress={() => navigation.navigate('Sample_DRM')}
        color="white"
      />
      <Button
        title="Sideloaded TextTrack Setup"
        onPress={() => navigation.navigate('Sample_SideloadedTextTrack')}
        color="white"
      />
      <Button
        title="Analytics Setup: Conviva"
        onPress={() => navigation.navigate('Sample_Conviva')}
        color="white"
      />
      <Button
        title="Analytics Setup: Comscore"
        onPress={() => navigation.navigate('Sample_Comscore')}
        color="white"
      />
      <Button
        title="Analytics Setup: Nielsen"
        onPress={() => navigation.navigate('Sample_Nielsen')}
        color="white"
      />
      <Button
        title="Analytics Setup: Adobe"
        onPress={() => navigation.navigate('Sample_Adobe')}
        color="white"
      />
    </View>
  );
}

OverviewScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
