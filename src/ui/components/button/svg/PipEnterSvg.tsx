import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const PipEnterSvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg aria-hidden="true" viewBox={'0 0 48 48'} {...context} {...props}>
            <Path d="M22.3 25.85h16.75V13H22.3ZM7 40q-1.2 0-2.1-.9Q4 38.2 4 37V11q0-1.2.9-2.1Q5.8 8 7 8h34q1.25 0 2.125.9T44 11v26q0 1.2-.875 2.1-.875.9-2.125.9Zm0-3V11v26Zm0 0h34V11H7v26Zm18.3-14.15V16h10.75v6.85Z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
