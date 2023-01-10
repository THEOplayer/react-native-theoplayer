import React from 'react';
import type { SvgProps } from 'react-native-svg';

export const defaultSvgStyle: SvgProps = {
  fill: 'white',
};

export const SvgContext = React.createContext<SvgProps>({ fill: 'white' });
