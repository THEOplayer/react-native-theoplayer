import { Image, ImageSourcePropType, ImageStyle, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { useState } from 'react';
import styles from './ActionButton.style';

export interface ActionButtonProps {
  icon?: ImageSourcePropType;
  touchable: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
}

export const ActionButton = (props: ActionButtonProps) => {
  const { icon, style, iconStyle, touchable } = props;
  const [focused, setFocused] = useState<boolean>(false);

  const iconFocusStyle = [{ tintColor: focused ? '#ffc50f' : 'white' }, iconStyle];

  if (!touchable) {
    return <View style={[styles.container, style]}>{icon && <Image style={[styles.image, iconFocusStyle]} source={icon} />}</View>;
  }

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={[styles.container, style]}
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
      {icon && <Image style={[styles.image, iconFocusStyle]} source={icon} />}
    </TouchableOpacity>
  );
};

ActionButton.defaultProps = {
  touchable: true,
};
