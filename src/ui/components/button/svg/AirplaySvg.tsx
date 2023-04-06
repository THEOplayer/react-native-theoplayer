import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const AirplaySvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg viewBox={'0 96 960 960'} {...context} {...props}>
            <Path d="m273 936 207-206 206 206H273Zm-133-80q-24 0-42-18t-18-42V276q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H631v-60h189V276H140v520h189v60H140Zm340-290Z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
