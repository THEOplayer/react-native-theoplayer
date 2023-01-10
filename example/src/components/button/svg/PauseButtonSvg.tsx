import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const PauseButtonSvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg viewBox={'0 0 48 48'} {...context} {...props}>
            <Path d="M30.95 40.3q-1.95 0-3.35-1.4-1.4-1.4-1.4-3.35v-23.1q0-1.95 1.4-3.35 1.4-1.4 3.35-1.4h4.6q1.95 0 3.35 1.4 1.4 1.4 1.4 3.35v23.1q0 1.95-1.4 3.35-1.4 1.4-3.35 1.4Zm-18.5 0q-1.95 0-3.35-1.4-1.4-1.4-1.4-3.35v-23.1q0-1.95 1.4-3.35 1.4-1.4 3.35-1.4h4.6q1.95 0 3.35 1.4 1.4 1.4 1.4 3.35v23.1q0 1.95-1.4 3.35-1.4 1.4-3.35 1.4Z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
