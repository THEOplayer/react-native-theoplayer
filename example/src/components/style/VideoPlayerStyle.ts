import type { ImageStyle, Insets, TextStyle, ViewStyle } from 'react-native';

export interface ColorTheme {
  primary: string;
  accent: string;
  uiBackground: string;
  seekBarCompleted: string;
  seekBarRemaining: string;
  menuBackground: string;
  text: string;
  textBackground: string;
}

export interface VideoPlayerStyle {
  colors: ColorTheme;
  slotView: {
    container: ViewStyle;
    background: ViewStyle;
    topSlot: ViewStyle;
    centerSlot: ViewStyle;
    bottomSlot: ViewStyle;
  };
  controlBar: {
    container: ViewStyle;
    buttonContainer: ViewStyle;
    buttonIcon: ImageStyle;
    buttonIconCenterControls: ViewStyle;
  };
  videoPlayer: {
    container: ViewStyle;
    fullScreenCenter: ViewStyle;
    errorContainer: ViewStyle;
    message: TextStyle;
    timeLabelContainer: ViewStyle;
    thumbnailContainerCarousel: ViewStyle;
    thumbnailContainerSingle: ViewStyle;
    thumbnailCurrentCarousel: ViewStyle;
    thumbnailCurrentSingle: ViewStyle;
    thumbnailCarousel: ViewStyle;
    timeLabel: TextStyle;
    liveContainer: ViewStyle;
    containerThumbnail: ViewStyle;
    thumbnail: ViewStyle;
    timeLabelThumbnail: TextStyle;
    liveDot: ViewStyle;
  };
  seekBar: {
    container: ViewStyle;
    progress: ViewStyle;
    innerProgressCompleted: ViewStyle;
    innerProgressRemaining: ViewStyle;
    touchable: ViewStyle;
    progressDot: ViewStyle;
    progressHitSlop: Insets;
  };
  menu: {
    container: ViewStyle;
    backButton: TextStyle;
    menus: ViewStyle;
    title: TextStyle;
    row: TextStyle;
  };
}

const BUTTON_SIZE = 40;
const CENTER_BUTTON_SIZE = 48;

export const defaultPlayerStyle: VideoPlayerStyle = {
  colors: {
    primary: 'white',
    accent: '#ffc50f',
    uiBackground: '#00000066',
    seekBarCompleted: 'white',
    seekBarRemaining: '#2C2C2C',
    menuBackground: '#00000099',
    text: 'white',
    textBackground: 'black',
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
    },
    background: {
      backgroundColor: '#00000066',
    },
    topSlot: {
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
    centerSlot: {
      alignItems: 'center',
      transform: [{ translateY: BUTTON_SIZE / 2 }],
    },
    bottomSlot: {
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  controlBar: {
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      zIndex: 1,
      height: BUTTON_SIZE,
    },
    buttonContainer: {
      alignSelf: 'center',
    },
    buttonIcon: {
      resizeMode: 'contain',
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
    },
    buttonIconCenterControls: {
      width: CENTER_BUTTON_SIZE,
      height: CENTER_BUTTON_SIZE,
    },
  },
  videoPlayer: {
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
      overflow: 'hidden',
    },
    fullScreenCenter: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      textAlignVertical: 'center',
      textAlign: 'center',
      fontSize: 16,
      paddingLeft: 50,
      paddingRight: 50,
    },
    timeLabelContainer: {
      marginLeft: 20,
      height: 20,
      alignSelf: 'center',
    },
    thumbnailContainerCarousel: {
      justifyContent: 'center',
      marginBottom: 15,
    },
    thumbnailContainerSingle: {
      marginBottom: 15,
    },
    thumbnailCurrentCarousel: {
      borderColor: '#ffc50f',
      borderWidth: 2,
    },
    thumbnailCurrentSingle: {
      borderWidth: 0,
    },
    thumbnailCarousel: {
      margin: 4,
    },
    timeLabel: {
      alignSelf: 'flex-start',
      fontSize: 16,
    },
    liveContainer: {
      flexDirection: 'row',
    },
    containerThumbnail: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    thumbnail: {
      overflow: 'hidden',
      backgroundColor: 'transparent',
    },
    timeLabelThumbnail: {
      alignSelf: 'center',
      fontSize: 16,
      lineHeight: 16,
    },
    liveDot: {
      width: 16,
      height: 16,
      marginLeft: -8,
      borderRadius: 8,
      backgroundColor: 'red',
    },
  },

  seekBar: {
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: 20,
    },
    progress: {
      flex: 1,
      flexDirection: 'row',
      borderRadius: 3,
      alignItems: 'center',
      overflow: 'visible',
    },
    innerProgressCompleted: {
      height: 6,
    },
    innerProgressRemaining: {
      height: 6,
      backgroundColor: '#2C2C2C',
    },
    touchable: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    progressDot: {
      width: 20,
      height: 20,
      marginLeft: -8,
      borderRadius: 10,
    },
    progressHitSlop: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
    },
  },
  menu: {
    container: {
      flex: 1,
      flexDirection: 'row',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      paddingVertical: 20,
      paddingLeft: 50,
      paddingRight: 40,
    },
    backButton: {
      fontSize: 16,
      lineHeight: 30,
    },
    menus: {
      flex: 1,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      paddingRight: 10,
    },
    title: {
      color: 'white',
      fontSize: 20,
      lineHeight: 24,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    row: {
      color: 'white',
      fontSize: 16,
      lineHeight: 24,
      padding: 10,
      textAlign: 'center',
    },
  },
};
