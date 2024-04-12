import * as React from 'react';
import {StyleSheet, Text, SafeAreaView} from 'react-native';

export const ConfigScreen = () => {
  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
      <Text style={styles.TEXT}>{`work in progress...`}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  TEXT: {
    marginTop: 25,
    marginHorizontal: 20,
    color: "white",
    textAlign: 'center'
  }
});
