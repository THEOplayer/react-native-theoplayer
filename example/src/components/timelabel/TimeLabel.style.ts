import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  timeLabel: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: 'white',
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
});
