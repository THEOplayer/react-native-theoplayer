import { ActionButton } from './actionbutton/ActionButton';
import React from 'react';
import { PlayerContext, UiContext } from '../util/PlayerContext';
import { BackSvg } from './svg/BackSvg';

interface BackButtonProps {
  onClose: () => void;
}

export const BackButton = (props: BackButtonProps) => {
  const { onClose } = props;
  return (
    <>
      <PlayerContext.Consumer>
        {(context: UiContext) => <ActionButton style={context.style.controlBar.buttonIcon} touchable={true} svg={<BackSvg />} onPress={onClose} />}
      </PlayerContext.Consumer>
    </>
  );
};
