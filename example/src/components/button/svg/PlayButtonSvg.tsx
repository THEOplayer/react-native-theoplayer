import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const PlayButtonSvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg viewBox={'0 0 48 48'} {...context} {...props}>
            <Path d="M18.4 37.85q-1.25.75-2.45.075-1.2-.675-1.2-2.075v-24q0-1.4 1.2-2.075 1.2-.675 2.45.075L37.2 21.9q1.15.7 1.15 1.975 0 1.275-1.15 1.925Z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
