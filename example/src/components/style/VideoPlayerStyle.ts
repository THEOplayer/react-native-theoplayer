import type { ActivityIndicatorProps, ImageStyle, Insets, TextStyle, ViewStyle } from 'react-native';

export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface VideoPlayerStyle {
  colors: ColorTheme;
  fullScreenCenter: ViewStyle;
  slotView: {
    container: ViewStyle;
    topSlot: ViewStyle;
    centerSlot: ViewStyle;
    bottomSlot: ViewStyle;
  };
  controlBar: {
    container: ViewStyle;
    buttonContainer: ViewStyle;
    buttonIcon: ImageStyle;
  };
  text: TextStyle;
  timeLabel: {
    container: TextStyle;
  };
  activityIndicator: ActivityIndicatorProps;
  seekBar: {
    container: ViewStyle;
    progress: ViewStyle;
    innerProgressCompleted: ViewStyle;
    innerProgressRemaining: ViewStyle;
    touchable: ViewStyle;
    progressDot: ViewStyle;
    progressHitSlop: Insets;
    liveContainer: ViewStyle;
    liveDot: ViewStyle;
    thumbnail: {
      thumbnail: ViewStyle;
      containerThumbnail: ViewStyle;
      containerCarousel: ViewStyle;
      containerSingle: ViewStyle;
      currentCarousel: ViewStyle;
      currentSingle: ViewStyle;
      carousel: ViewStyle;
    };
  };
  menu: {
    container: ViewStyle;
    backButton: TextStyle;
    subMenu: ViewStyle;
    title: TextStyle;
    row: TextStyle;
  };
}

export const BUTTON_SIZE = 40;
export const CENTER_BUTTON_SIZE = 48;

export const defaultPlayerStyle: VideoPlayerStyle = {
  colors: {
    primary: 'white',
    secondary: '#2C2C2C',
    accent: '#ffc50f',
    background: '#00000066',
    text: 'white',
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
    topSlot: {
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
    centerSlot: {
      alignItems: 'center',
      zIndex: 2,
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
  },
  text: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 16,
  },
  timeLabel: {
    container: {
      marginLeft: 20,
      height: 20,
      alignSelf: 'center',
    },
  },
  activityIndicator: {
    size: 60,
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
    liveContainer: {
      flexDirection: 'row',
    },
    liveDot: {
      width: 16,
      height: 16,
      marginLeft: -8,
      borderRadius: 8,
      backgroundColor: 'red',
    },
    thumbnail: {
      containerCarousel: {
        justifyContent: 'center',
        marginBottom: 15,
      },
      containerSingle: {
        marginBottom: 15,
      },
      currentCarousel: {
        borderWidth: 2,
      },
      currentSingle: {
        borderWidth: 0,
      },
      carousel: {
        margin: 4,
      },
      containerThumbnail: {
        alignItems: 'center',
        flexDirection: 'row',
      },
      thumbnail: {
        overflow: 'hidden',
        backgroundColor: 'transparent',
      },
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
    subMenu: {
      flex: 1,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      paddingRight: 10,
    },
    title: {
      fontSize: 20,
      lineHeight: 24,
      padding: 10,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    row: {
      fontSize: 16,
      lineHeight: 24,
      padding: 10,
      textAlign: 'center',
    },
  },
};
