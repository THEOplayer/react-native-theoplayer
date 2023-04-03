import { ActionButton } from './actionbutton/ActionButton';
import React from 'react';
import { BackSvg } from './svg/BackSvg';

interface BackButtonProps {
  /**
   * The callback function is called when the button is pressed.
   */
  onClose: () => void;
}

/**
 * The default back button for the react-native-theoplayer UI.
 */
export const BackButton = (props: BackButtonProps) => {
  const { onClose } = props;
  return <ActionButton touchable={true} svg={<BackSvg />} onPress={onClose} />;
};
