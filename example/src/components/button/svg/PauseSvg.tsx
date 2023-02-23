import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const PauseSvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg aria-hidden="true" viewBox={'0 0 24 24'} {...context} {...props}>
            <Path d="M2.108 1.914Q2.108.5 3.522.5h4.171q1.415 0 1.415 1.414v20.172q0 1.414-1.415 1.414H3.522q-1.414 0-1.414-1.414zm12.784 0Q14.892.5 16.307.5h4.171q1.414 0 1.414 1.414v20.172q0 1.414-1.414 1.414h-4.171q-1.415 0-1.415-1.414z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
