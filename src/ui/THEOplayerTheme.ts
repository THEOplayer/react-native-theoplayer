import type { TextStyle } from 'react-native';

export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface THEOplayerTheme {
  colors: ColorTheme;
  text: TextStyle;
}

export const BUTTON_SIZE = 40;

export const DEFAULT_THEOPLAYER_THEME: THEOplayerTheme = {
  colors: {
    primary: 'white',
    secondary: '#2C2C2C',
    accent: '#ffc50f',
    background: '#00000075',
    text: 'white',
  },
  text: {
    textAlignVertical: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16,
  },
};
