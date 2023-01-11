import React from 'react';
import { PlayButton } from './PlayButton';
import { PlayerStyleContext, VideoPlayerStyle } from '../style/VideoPlayerStyle';

export const BigPlayButton = () => {
  return (
    <PlayerStyleContext.Consumer>
      {(styleContext: VideoPlayerStyle) => <PlayButton style={styleContext.centerControlBarButton} />}
    </PlayerStyleContext.Consumer>
  );
};
