import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const PlaySvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg aria-hidden="true" viewBox={'0 0 90 90'} {...context} {...props}>
            <Path d="M77.504 50.868c-7.236 5.156-16.584 10.914-28.04 17.269-11.044 6.207-20.729 11.081-29.053 14.625l-9.224 3.43c-.581-2.493-1.125-6.188-1.632-11.08-1.143-9.75-1.715-20.513-1.715-32.288 0-10.781.777-20.858 2.333-30.234l2.251-10.772 9.787 3.29c8.476 3.375 17.663 8.166 27.563 14.373 10.48 6.562 19.472 12.805 26.97 18.73 3.749 2.982 6.449 5.279 8.099 6.891l-7.339 5.766" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
