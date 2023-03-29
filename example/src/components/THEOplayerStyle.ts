import type { TextStyle, ViewStyle } from 'react-native';

export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface THEOplayerStyle {
  colors: ColorTheme;
  slotView: {
    container: ViewStyle;
    topSlot: ViewStyle;
    centerSlot: ViewStyle;
    bottomSlot: ViewStyle;
  };
  text: TextStyle;
}

export const BUTTON_SIZE = 40;
export const CENTER_BUTTON_SIZE = 52;

export const defaultPlayerStyle: THEOplayerStyle = {
  colors: {
    primary: 'white',
    secondary: '#2C2C2C',
    accent: '#ffc50f',
    background: '#00000066',
    text: 'white',
  },
  slotView: {
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 1,
      overflow: 'hidden',
    },
    topSlot: {
      zIndex: 2,
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
    centerSlot: {
      alignItems: 'center',
      zIndex: 1,
    },
    bottomSlot: {
      zIndex: 2,
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  text: {
    textAlignVertical: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16,
  },
};
