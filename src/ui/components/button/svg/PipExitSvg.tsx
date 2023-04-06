import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const PipExitSvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg viewBox={'0 0 48 48'} {...context} {...props}>
            <Path d="M7 40q-1.2 0-2.1-.9Q4 38.2 4 37V22h3v15h34V11H22V8h19q1.2 0 2.1.9.9.9.9 2.1v26q0 1.2-.9 2.1-.9.9-2.1.9Zm27.85-7L37 30.85l-7.55-7.5h5.9v-3h-11v11h3V25.5ZM4 19V8h15v11Zm20 5Z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
