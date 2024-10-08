import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import { ImageStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

export interface PosterProps {
  uri: string | undefined;
  style?: StyleProp<ImageStyle> | undefined;
}

export const Poster = (props: PosterProps) => {
  const { uri } = props;
  if (!uri) {
    return <></>;
  }
  return (
    <View style={[StyleSheet.absoluteFill, { justifyContent: 'center' }]}>
      <Image style={[{ aspectRatio: 16 / 9 }, props.style]} source={{ uri }} />
    </View>
  );
};
