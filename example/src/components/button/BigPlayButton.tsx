import React from 'react';
import { PlayButton } from './PlayButton';
import { PlayerContext, PlayerWithStyle } from '../util/Context';

export const BigPlayButton = () => {
  return (
    <PlayerContext.Consumer>
      {(context: PlayerWithStyle) => <PlayButton style={context.style.controlBar.buttonIconCenterControls} />}
    </PlayerContext.Consumer>
  );
};
