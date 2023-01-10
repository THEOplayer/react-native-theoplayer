import React from 'react';
import { PlayButton } from './PlayButton';
import { controlBarStyle } from '../controlbar/ControlBar';

export const BigPlayButton = () => {
  return <PlayButton style={controlBarStyle.centerControls} />;
};
