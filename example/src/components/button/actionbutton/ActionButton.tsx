import { Image, ImageSourcePropType, ImageStyle, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { ReactNode, useState } from 'react';
import { defaultSvgStyle, SvgContext } from '../svg/SvgUtils';
import { PlayerStyleContext, VideoPlayerStyle } from '../../style/VideoPlayerStyle';

export interface ActionButtonProps {
  icon?: ImageSourcePropType;
  svg?: ReactNode;
  touchable: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
}

export const ActionButton = (props: ActionButtonProps) => {
  const { icon, style, iconStyle, touchable, svg } = props;
  const [focused, setFocused] = useState<boolean>(false);

  const tintColor = focused ? '#ffc50f' : 'white';
  const iconFocusStyle = [{ tintColor }, iconStyle];

  if (!touchable) {
    return <View style={style}>{svg}</View>;
  }

  return (
    <PlayerStyleContext.Consumer>
      {(styleContext: VideoPlayerStyle) => (
        <TouchableOpacity
          activeOpacity={1.0}
          style={styleContext.controlBarContainer}
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
          {/* Give priority to SVG over image sources.*/}
          {svg && (
            <SvgContext.Provider value={{ ...defaultSvgStyle, fill: tintColor, height: '100%', width: '100%' }}>
              <View style={[styleContext.controlBarButtonImage, iconFocusStyle]}>{svg}</View>
            </SvgContext.Provider>
          )}
          {svg === undefined && icon && <Image style={[styleContext.controlBarButtonImage, iconFocusStyle]} source={icon} />}
        </TouchableOpacity>
      )}
    </PlayerStyleContext.Consumer>
  );
};

ActionButton.defaultProps = {
  touchable: true,
};
