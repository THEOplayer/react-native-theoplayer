import { Dimensions, StyleSheet } from 'react-native';

export default StyleSheet.create({
  base: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  fullscreenOverride: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').height
  }
});
