import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
});
