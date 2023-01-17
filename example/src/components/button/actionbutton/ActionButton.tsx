import { Image, ImageSourcePropType, ImageStyle, Platform, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { ReactNode, useState } from 'react';
import { SvgContext } from '../svg/SvgUtils';
import { PlayerContext, PlayerWithStyle } from '../../util/PlayerContext';

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

  const shouldChangeTintColor = focused && Platform.isTV;

  if (!touchable) {
    return <View style={style}>{svg}</View>;
  }

  return (
    <PlayerContext.Consumer>
      {(context: PlayerWithStyle) => (
        <TouchableOpacity
          activeOpacity={1.0}
          style={context.style.controlBar.buttonContainer}
          tvParallaxProperties={{ enabled: false }}
          onPress={() => {
            const { onPress } = props;
            if (onPress) {
              onPress();
            }
          }}
          onFocus={() => {
            context.animation.onTouch();
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}>
          {/* Give priority to SVG over image sources.*/}
          {svg && (
            <SvgContext.Provider
              value={{
                fill: shouldChangeTintColor ? context.style.colors.accent : context.style.colors.primary,
                height: '100%',
                width: '100%',
              }}>
              <View style={[context.style.controlBar.buttonIcon, iconStyle]}>{svg}</View>
            </SvgContext.Provider>
          )}
          {svg === undefined && icon && (
            <Image
              style={[
                context.style.controlBar.buttonIcon,
                iconStyle,
                { tintColor: shouldChangeTintColor ? context.style.colors.accent : context.style.colors.primary },
              ]}
              source={icon}
            />
          )}
        </TouchableOpacity>
      )}
    </PlayerContext.Consumer>
  );
};

ActionButton.defaultProps = {
  touchable: true,
};
