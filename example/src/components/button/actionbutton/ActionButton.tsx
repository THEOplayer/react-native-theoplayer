import { Image, ImageSourcePropType, ImageStyle, Platform, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { ReactNode, useContext, useState } from 'react';
import { SvgContext } from '../svg/SvgUtils';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

export interface ActionButtonProps {
  icon?: ImageSourcePropType;
  svg?: ReactNode;
  touchable: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  highlighted?: boolean;
}

export const DEFAULT_ACTION_BUTTON_STYLE: ViewStyle = {
  height: '100%',
  aspectRatio: 1,
  padding: 5,
};

export const ActionButton = (props: ActionButtonProps) => {
  const { icon, style, touchable, svg, onPress, highlighted } = props;
  const [focused, setFocused] = useState<boolean>(false);
  const context = useContext(PlayerContext);

  const shouldChangeTintColor = highlighted || (focused && Platform.isTV);

  if (!touchable) {
    return <View style={[DEFAULT_ACTION_BUTTON_STYLE, style]}>{svg}</View>;
  }

  const onTouch = () => {
    if (context.ui.buttonsEnabled_) {
      onPress?.();
    }
    context.ui.onUserAction_();
  };

  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <TouchableOpacity
          activeOpacity={1.0}
          style={[DEFAULT_ACTION_BUTTON_STYLE, style]}
          tvParallaxProperties={{ enabled: false }}
          onPress={onTouch}
          onFocus={() => {
            context.ui.onUserAction_();
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          {...(Platform.OS === 'web' ? { onClick: onTouch } : {})}>
          {/* Give priority to SVG over image sources.*/}
          {svg && (
            <SvgContext.Provider
              value={{
                fill: shouldChangeTintColor ? context.style.colors.accent : context.style.colors.primary,
                height: '100%',
                width: '100%',
              }}>
              <View>{svg}</View>
            </SvgContext.Provider>
          )}
          {svg === undefined && icon && (
            <Image
              style={[
                { height: '100%', width: '100%' },
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
