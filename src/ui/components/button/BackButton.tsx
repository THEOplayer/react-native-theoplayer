import { ActionButton } from './actionbutton/ActionButton';
import React from 'react';
import { BackSvg } from './svg/BackSvg';

interface BackButtonProps {
  onClose: () => void;
}

export const BackButton = (props: BackButtonProps) => {
  const { onClose } = props;
  return <ActionButton touchable={true} svg={<BackSvg />} onPress={onClose} />;
};
