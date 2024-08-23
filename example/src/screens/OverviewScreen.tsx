import * as React from 'react';
import { Button, View, Platform } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigators/SamplesStackNavigator';

const c = Platform.OS === 'ios' ? 'white' : 'transparent';

type OverviewScreenProps = StackScreenProps<RootStackParamList, 'SampleOverview'>;
export const OverviewScreen = ({ navigation }: OverviewScreenProps) => {
  return (
    <View style={{ flex: 1, margin: 25 }}>
      <Button title="Minimal Setup" onPress={() => navigation.navigate('SampleMinimal')} color={c} />
      <Button title="Extended Setup" onPress={() => navigation.navigate('SampleExtended')} color={c} />
      <Button title="PresentationModes" onPress={() => navigation.navigate('SamplePresentationModes')} color={c} />
      <Button title="DRM" onPress={() => navigation.navigate('SampleDRM')} color={c} />
      <Button title="Sideloaded TextTrack" onPress={() => navigation.navigate('SampleSideloadedTextTrack')} color={c} />
      <Button title="Flashlist Multi" onPress={() => navigation.navigate('SampleFlashlist', { reelMode: false })} color={c} />
      <Button title="Flashlist Reel" onPress={() => navigation.navigate('SampleFlashlist', { reelMode: true })} color={c} />
      <Button title="Analytics: Conviva" onPress={() => navigation.navigate('SampleConviva')} color={c} />
      <Button title="Analytics: Comscore" onPress={() => navigation.navigate('SampleComscore')} color={c} />
      <Button title="Analytics: Nielsen" onPress={() => navigation.navigate('SampleNielsen')} color={c} />
      <Button title="Analytics: Adobe" onPress={() => navigation.navigate('SampleAdobe')} color={c} />
      <Button title="Analytics: Mux" onPress={() => navigation.navigate('SampleMux')} color={c} />
    </View>
  );
};
