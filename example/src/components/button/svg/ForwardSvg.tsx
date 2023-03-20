import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const ForwardSvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg aria-hidden="true" viewBox={'0 0 24 24'} {...context} {...props}>
            <Path d="M6.925 21.325q-.45-.45-.45-1.113 0-.662.45-1.112l7.1-7.1L6.9 4.875q-.45-.45-.462-1.1-.013-.65.462-1.125.475-.45 1.125-.45t1.1.45l8.425 8.425q.2.2.287.437.088.238.088.488t-.088.488q-.087.237-.287.437L9.125 21.35q-.45.45-1.087.45-.638 0-1.113-.475Z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
