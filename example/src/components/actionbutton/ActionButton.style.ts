import { StyleSheet } from 'react-native';

const DEFAULT_SIZE = 30;

export default StyleSheet.create({
  container: {
    marginLeft: 20,
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
