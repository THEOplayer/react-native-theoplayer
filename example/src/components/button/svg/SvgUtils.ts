import React from 'react';
import type { SvgProps } from 'react-native-svg';

export const SvgContext = React.createContext<SvgProps>({ fill: 'white' });
