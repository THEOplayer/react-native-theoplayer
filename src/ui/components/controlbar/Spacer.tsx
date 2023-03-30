import { View } from 'react-native';
import React from 'react';

interface SpacerProps {
  grow?: number;
}

export const Spacer = (props: SpacerProps) => {
  return <View style={{ flexGrow: props.grow ?? 1 }} />;
};
