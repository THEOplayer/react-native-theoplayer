import { DarkTheme } from '@react-navigation/native';
import { Platform } from 'react-native';

const backgroundColor = Platform.OS === 'web' ? 'transparent' : 'black';

export const navTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: '#FFC50F',
    background: backgroundColor,
  },
};

export const linking = {
  prefixes: [],
  config: {
    screens: {
      SampleOverview: 'sampleOverview',
      SampleExtended: 'sampleExtended',
      SampleMinimal: 'sampleMinimal',
      SamplePresentationModes: 'samplePresentationmodes',
      SampleDRM: 'sampleDrm',
      SampleSideloadedTextTrack: 'sampleSideloadedTexttracks',
      SampleFlashlist: 'sampleFlashlist',
      SampleConviva: 'sampleConviva',
      SampleComscore: 'sampleComscore',
      SampleNielsen: 'sampleNielsen',
      SampleAdobe: 'sampleAdobe',
      SampleMux: 'sampleMux',
    },
  },
};
