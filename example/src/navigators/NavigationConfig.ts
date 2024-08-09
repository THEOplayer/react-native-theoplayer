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
      Sample_Extended: 'sampleExtended',
      Sample_Minimal: 'sampleMinimal',
      Sample_PresentationModes: 'samplePresentationmodes',
      Sample_DRM: 'sampleDrm',
      Sample_SideloadedTextTrack: 'sampleSideloadedTexttracks',
      Sample_Conviva: 'sampleConviva',
      Sample_Comscore: 'sampleComscore',
      Sample_Nielsen: 'sampleNielsen',
      Sample_Adobe: 'sampleAdobe',
      Sample_Mux: 'sampleMux',
    },
  },
};
