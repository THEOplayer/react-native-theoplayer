import type { ImageStyle, Insets, TextStyle, ViewStyle } from 'react-native';
import React from 'react';

export interface VideoPlayerStyle {
  slotView: {
    containerSlotView: ViewStyle;
    backgroundSlotView: ViewStyle;
    topSlot: ViewStyle;
    centerSlot: ViewStyle;
    bottomSlot: ViewStyle;
  };
  controlBar: {
    videoPlayerContainer: ViewStyle;
    fullScreen: ViewStyle;
    controlBar: ViewStyle;
    controlBarButton: ViewStyle;
    controlBarImage: ImageStyle;
    castButton: ViewStyle;
    controlBarContainer: ViewStyle;
    controlBarButtonImage: ImageStyle;
    centerControlBarButton: ViewStyle;
  };
  videoPlayer: {
    container: ViewStyle;
    background: ViewStyle;
    fullScreenCenter: ViewStyle;
    controlsContainer: ViewStyle;
    topContainer: ViewStyle;
    bottomControlsContainer: ViewStyle;
    errorContainer: ViewStyle;
    message: TextStyle;
    timeLabel: ViewStyle;
    thumbnailContainerCarousel: ViewStyle;
    thumbnailContainerSingle: ViewStyle;
    thumbnailCurrentCarousel: ViewStyle;
    thumbnailCurrentSingle: ViewStyle;
    thumbnailCarousel: ViewStyle;
    timeLabel2: TextStyle;
    liveContainer: ViewStyle;
    containerThumbnail: ViewStyle;
    thumbnail: ViewStyle;
    timeLabelThumbnail: TextStyle;
    liveDot: ViewStyle;
  };
  seekBar: {
    containerSeekBar: ViewStyle;
    progress: ViewStyle;
    innerProgressCompleted: ViewStyle;
    innerProgressRemaining: ViewStyle;
    touchable: ViewStyle;
    progressDot: ViewStyle;
    progressHitSlop: Insets;
  };
  modalMenu: {
    containerModalMenu: ViewStyle;
    modal: ViewStyle;
    title: TextStyle;
    rowContainer: ViewStyle;
  };
  menuButton: {
    containerMenuButton: ViewStyle;
  };
}

const BUTTON_SIZE = 40;
const CENTER_BUTTON_SIZE = 48;

export const defaultPlayerStyle: VideoPlayerStyle = {
  slotView: {
    containerSlotView: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 1,
    },
    backgroundSlotView: {
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
    videoPlayerContainer: {
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
    fullScreen: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    controlBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      zIndex: 1,
      height: BUTTON_SIZE,
    },
    controlBarButton: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
    },
    controlBarImage: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
    },
    castButton: {
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      tintColor: 'white',
    },
    controlBarContainer: {
      alignSelf: 'center',
    },
    controlBarButtonImage: {
      resizeMode: 'contain',
      width: BUTTON_SIZE,
      height: BUTTON_SIZE,
      tintColor: 'white',
    },
    centerControlBarButton: {
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
    background: {
      position: 'absolute',
      height: 100,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: '#00000066',
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
    controlsContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 10,
      paddingBottom: 20,
      zIndex: 1,
    },
    topContainer: {
      height: 30,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      zIndex: 1,
    },
    bottomControlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      color: 'white',
      backgroundColor: 'black',
    },
    timeLabel: {
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
    timeLabel2: {
      alignSelf: 'flex-start',
      fontSize: 16,
      color: 'white',
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
      color: 'white',
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
    containerSeekBar: {
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
      backgroundColor: 'white',
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
      backgroundColor: 'white',
    },
    progressHitSlop: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
    },
  },
  modalMenu: {
    containerModalMenu: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00000099',
    },
    modal: {
      minWidth: 250,
      backgroundColor: '#282828cc',
    },
    title: {
      color: '#ffc50f',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: 'bold',
      padding: 10,
    },
    rowContainer: {
      padding: 15,
      marginLeft: 5,
    },
  },
  menuButton: {
    containerMenuButton: {
      marginLeft: 20,
      marginVertical: 10,
      alignSelf: 'center',
    },
  },
};

export const PlayerStyleContext = React.createContext<VideoPlayerStyle>(defaultPlayerStyle);
