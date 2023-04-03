import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';
import React from 'react';
import { SvgContext } from './SvgUtils';

export const FullScreenExitSvg = (props: SvgProps) => {
  return (
    <SvgContext.Consumer>
      {(context) => (
        <>
          <Svg viewBox={'0 0 48 48'} {...context} {...props}>
            <Path d="M18.15 39.4q-1 0-1.675-.675T15.8 37.05V32.2h-4.85q-1 0-1.675-.675T8.6 29.85q0-1 .675-1.675t1.675-.675h7.2q1 0 1.675.675t.675 1.675v7.2q0 1-.675 1.675t-1.675.675Zm-7.2-18.9q-1 0-1.675-.675T8.6 18.15q0-1 .675-1.675t1.675-.675h4.85v-4.85q0-1 .675-1.7t1.675-.7q1 0 1.675.7t.675 1.7v7.2q0 1-.675 1.675t-1.675.675Zm18.9 18.9q-1 0-1.675-.675T27.5 37.05v-7.2q0-1 .675-1.675t1.675-.675h7.2q1 0 1.7.675t.7 1.675q0 1-.7 1.675t-1.7.675H32.2v4.85q0 1-.675 1.675t-1.675.675Zm0-18.9q-1 0-1.675-.675T27.5 18.15v-7.2q0-1 .675-1.7t1.675-.7q1 0 1.675.7t.675 1.7v4.85h4.85q1 0 1.7.675t.7 1.675q0 1-.7 1.675t-1.7.675Z" />
          </Svg>
        </>
      )}
    </SvgContext.Consumer>
  );
};
