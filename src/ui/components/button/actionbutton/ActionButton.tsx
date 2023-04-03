import { Image, ImageSourcePropType, Platform, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { ReactNode, useContext, useState } from 'react';
import { SvgContext } from '../svg/SvgUtils';
import { PlayerContext, UiContext } from '../../util/PlayerContext';

export interface ActionButtonProps {
  /**
   * The image to but in the button.
   */
  icon?: ImageSourcePropType;
  /**
   * The SVG component to put in the button. Takes priority over images.
   */
  svg?: ReactNode;
  /**
   * Whether the button should be touchable. This is `true` by default.
   */
  touchable: boolean;
  /**
   * The callback when the button is pressed.
   */
  onPress?: () => void;
  /**
   * The styling overrides.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Whether the button should be highlighted with `ColorTheme.iconSelected` color.
   */
  highlighted?: boolean;
}

/**
 * The default style applied to the ActionButton
 */
export const DEFAULT_ACTION_BUTTON_STYLE: ViewStyle = {
  height: '100%',
  aspectRatio: 1,
  padding: 5,
};

/**
 * The default button component that renders an image/svg source for the `react-native-theoplayer` UI.
 */
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
          style={[DEFAULT_ACTION_BUTTON_STYLE, style]}
          tvParallaxProperties={{ enabled: false }}
          onPress={onTouch}
          onFocus={() => {
            context.ui.onUserAction_();
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}>
          {/* Give priority to SVG over image sources.*/}
          {svg && (
            <SvgContext.Provider
              value={{
                fill: shouldChangeTintColor ? context.style.colors.iconSelected : context.style.colors.icon,
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
                { tintColor: shouldChangeTintColor ? context.style.colors.iconSelected : context.style.colors.icon },
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
