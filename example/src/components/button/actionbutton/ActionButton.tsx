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
  iconStyle?: StyleProp<ImageStyle>;
}

export const ActionButton = (props: ActionButtonProps) => {
  const { icon, style, iconStyle, touchable, svg, onPress } = props;
  const [focused, setFocused] = useState<boolean>(false);
  const context = useContext(PlayerContext);

  const shouldChangeTintColor = focused && Platform.isTV;

  if (!touchable) {
    return <View style={style}>{svg}</View>;
  }

  const onTouch = () => {
    if (context.ui.buttonsEnabled_) {
      onPress?.();
    }
    context.ui.requestShowUi();
  };

  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => (
        <TouchableOpacity
          activeOpacity={1.0}
          style={context.style.controlBar.buttonContainer}
          tvParallaxProperties={{ enabled: false }}
          onPress={onTouch}
          onFocus={() => {
            context.ui.requestShowUi();
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
