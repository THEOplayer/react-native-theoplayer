import React from 'react';
import { Platform, StyleProp, ViewStyle, TVFocusGuideView } from 'react-native';

export interface AutoFocusGuideProps {
  /**
   * Overrides for the style of the guide.
   */
  style?: StyleProp<ViewStyle>;
}

const FOCUS_GUIDE_STYLE: ViewStyle = {
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
};

/**
 * A TV platform FocusGuide with autofocus capabilities
 */
export const AutoFocusGuide = (props: React.PropsWithChildren<AutoFocusGuideProps>) => {
  const { style, children } = props;
  if (!Platform.isTVOS) {
    return <>{children}</>;
  } else {
    return (
      <TVFocusGuideView autoFocus style={[FOCUS_GUIDE_STYLE, style]}>
        {children}
      </TVFocusGuideView>
    );
  }
};
