import { MutedIcon, UnMutedIcon } from '../../res/images';
import styles from '../videoplayer/VideoPlayerUI.style';
import { ActionButton } from './actionbutton/ActionButton';
import React, { useContext, useState } from 'react';
import { PlayerContext } from '../util/Context';

export const MuteButton = () => {
  const player = useContext(PlayerContext);
  const [muted, setMuted] = useState(player.muted);

  const toggleMuted = () => {
    const newMuted = !player.muted;
    player.muted = newMuted;
    console.log('newMuted', newMuted);
    setMuted(newMuted);
  };

  return (
    <ActionButton
      style={{ marginLeft: 0 }}
      icon={muted ? MutedIcon : UnMutedIcon}
      onPress={toggleMuted}
      iconStyle={styles.menuIcon}
      touchable={true}
    />
  );
};
