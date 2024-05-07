import { DarkTheme } from '@react-navigation/native';

export const navTheme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: '#FFC50F',
  },
};

export const linking = {
  prefixes: ['https://mychat.com', 'mychat://'],
  config: {
    screens: {
      SampleOverview: 'sample/overview',
      Sample_Extended: 'sample/extended',
      Sample_Minimal: 'sample/minimal',
      Sample_PresentationModes: 'sample/presentationmodes',
      Sample_DRM: 'sample/drm',
      Sample_SideloadedTextTrack: 'sample/sideloadedtexttracks',
      Sample_Conviva: 'sample/conviva',
      Sample_Comscore: 'sample/comscore',
      Sample_Nielsen: 'sample/nielsen',
      Sample_Adobe: 'sample/adobe',
    },
  },
};
