import { PlayerContext } from '@theoplayer/react-native-ui';
import React, { useCallback, useContext } from 'react';
import { MediaCache } from 'react-native-theoplayer';
import { MenuRadioButton } from '@theoplayer/react-native-ui/src/ui/components/menu/common/MenuRadioButton';

export const MediaCacheDownloadButton = () => {
  const playerContext = useContext(PlayerContext);

  const onPress = useCallback(() => {
    const currentSource = playerContext.player?.source;
    if (currentSource) {
      MediaCache.createTask(currentSource, {
        amount: '100%',
      });
    }
  }, []);

  return <MenuRadioButton label={'Create download task'} uid={0} onSelect={onPress} />;
};
