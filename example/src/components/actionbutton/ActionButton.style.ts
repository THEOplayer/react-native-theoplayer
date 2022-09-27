import { StyleSheet } from 'react-native';

const DEFAULT_SIZE = 25;

export default StyleSheet.create({
  container: {
    marginLeft: 15,
    marginVertical: 10,
    alignSelf: 'center',
  },
  image: {
    resizeMode: 'contain',
    width: DEFAULT_SIZE,
    height: DEFAULT_SIZE,
    tintColor: 'white',
  },
});
