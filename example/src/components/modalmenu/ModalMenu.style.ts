import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
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
});
