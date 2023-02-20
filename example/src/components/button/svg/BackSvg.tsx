import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const BackSvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg viewBox={'0 96 960 960'} {...context} {...props}>
            <Path d="M428 873 163 609q-7-7-10.5-15.5T149 576q0-9 3.5-17.5T163 543l266-266q14-14 33-13.5t33 14.5q14 15 14 34t-14 33L312 529h434q20 0 33.5 13.5T793 576q0 20-13.5 33.5T746 623H312l184 185q14 14 13.5 32.5T495 873q-15 15-34 15t-33-15Z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
