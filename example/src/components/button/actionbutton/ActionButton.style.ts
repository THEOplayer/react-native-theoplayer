import { StyleSheet } from 'react-native';

const DEFAULT_SIZE = 25;

export default StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginVertical: 5,
    alignSelf: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE,
    tintColor: 'white',
  },
});
