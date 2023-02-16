import React from 'react';
import { PlayButton } from './PlayButton';
import { PlayerContext, UiContext } from '../util/PlayerContext';

export const BigPlayButton = () => {
  return (
    <PlayerContext.Consumer>
      {(context: UiContext) => <PlayButton style={context.style.controlBar.buttonIconCenterControls} />}
    </PlayerContext.Consumer>
  );
};
