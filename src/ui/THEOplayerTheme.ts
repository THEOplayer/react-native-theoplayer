import type { TextStyle } from 'react-native';

/**
 * The theme colors.
 */
export interface ColorTheme {
  /**
   * The color of the UI background.
   */
  uiBackground: string;
  /**
   * The color of the error display background.
   */
  errorBackground: string;
  /**
   * The color of the SVG icons.
   */
  icon: string;
  /**
   * The color of the SVG icons when they are selected.
   */
  iconSelected: string;
  /**
   * The color of the text components.
   */
  text: string;
  /**
   * The color of the text components when they are selected.
   */
  textSelected: string;
  /**
   * The color of the text component background when it is selected.
   */
  textSelectedBackground: string;
  /**
   * The color of the left side of the seek bar.
   */
  seekBarMinimum: string;
  /**
   * The color of the right side of the seek bar.
   */
  seekBarMaximum: string;
  /**
   * The color of the dot on the seek bar.
   */
  seekBarDot: string;
}

/**
 * The theme used by `react-native-theoplayer` UI components.
 */
export interface THEOplayerTheme {
  /**
   * The theme colors.
   */
  colors: ColorTheme;
  /**
   * The styling for all text components.
   */
  text: TextStyle;
  /**
   * The amount of time after a user action where UI animations will resume.
   */
  fadeAnimationTimoutMs: number;
}

/**
 * The default control bar size.
 */
export const DEFAULT_CONTROL_BAR_HEIGHT = 40;

/**
 * The default center control bar size.
 */
export const DEFAULT_CENTER_CONTROL_BAR_HEIGHT = 52;

/**
 * The default theme for the UI.
 */
export const DEFAULT_THEOPLAYER_THEME: THEOplayerTheme = {
  colors: {
    uiBackground: '#00000080',
    errorBackground: '#2C2C2C',
    icon: '#FFFFFF',
    iconSelected: '#FFC50F',
    text: '#FFFFFF',
    textSelected: '#2C2C2C',
    textSelectedBackground: '#FFFFFF',
    seekBarMinimum: '#FFFFFF',
    seekBarMaximum: '#FFFFFF50',
    seekBarDot: '#FFFFFF',
  },
  text: {
    textAlignVertical: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16,
  },
  fadeAnimationTimoutMs: 2500,
};
