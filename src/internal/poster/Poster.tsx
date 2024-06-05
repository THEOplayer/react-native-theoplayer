import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export const Poster = (props: { uri: string | undefined }) => {
  const { uri } = props;
  if (uri === undefined) {
    return <></>;
  }
  return (
    <View style={[StyleSheet.absoluteFill, { justifyContent: 'center' }]}>
      <Image style={{ aspectRatio: 16 / 9 }} source={{ uri }} />
    </View>
  );
};
