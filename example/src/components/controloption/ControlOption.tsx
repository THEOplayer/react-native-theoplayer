import { StyleProp, TouchableOpacity, Text, TextStyle } from 'react-native';
import React, { useState } from 'react';
import { defaultPlayerStyle } from '../style/VideoPlayerStyle';

export interface ControlOptionProps {
  onPress?: () => void;
  text?: string;
  isSelected?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

export const ControlOption = (props: ControlOptionProps) => {
  const { textStyle, text, isSelected } = props;
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <TouchableOpacity
      style={defaultPlayerStyle.container}
      activeOpacity={1.0}
      tvParallaxProperties={{ enabled: false }}
      onPress={() => {
        const { onPress } = props;
        if (onPress) {
          onPress();
        }
      }}
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}>
      <Text style={[textStyle, { fontWeight: isSelected ? 'bold' : 'normal', color: focused ? '#ffc50f' : 'white' }]}>[{text}]</Text>
    </TouchableOpacity>
  );
};
