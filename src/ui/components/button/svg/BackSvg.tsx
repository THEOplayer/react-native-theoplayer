import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const BackSvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg aria-hidden="true" viewBox={'0 0 24 24'} {...context} {...props}>
            <Path d="m10.525 19.275-6.375-6.35q-.175-.2-.262-.437Q3.8 12.25 3.8 12t.088-.488q.087-.237.262-.437l6.375-6.35q.375-.375.925-.388.55-.012.95.388.375.4.388.937.012.538-.363.938l-4.1 4.075H18.35q.55 0 .938.387.387.388.387.938 0 .55-.387.938-.388.387-.938.387H8.325l4.1 4.075q.35.375.363.925.012.55-.363.95-.4.4-.95.4-.55 0-.95-.4Z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
