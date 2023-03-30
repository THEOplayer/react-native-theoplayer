import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const LanguageSvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg aria-hidden="true" viewBox={'0 0 24 24'} {...context} {...props}>
            <Path d="M17.469 15.446a6.892 6.892 310 1 0-4.772 3.342l2.872.986q1.9.626 1.9-1.374v-2.954l2.598 1.5V22q0 2-1.899 1.374l-4.95-1.632a9.892 9.892 310 1 1 6.849-4.796zM7 10a1 1 180 1 0 0 2 1 1 180 1 0 0-2zm4 0a1 1 180 1 0 0 2h5a1 1 180 1 0 0-2zm-3 4a1 1 180 1 0 0 2h3a1 1 180 1 0 0-2zm7 0a1 1 180 1 0 0 2 1 1 180 1 0 0-2z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
