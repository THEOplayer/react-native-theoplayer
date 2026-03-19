import { PlayerContext } from '@theoplayer/react-native-ui';
import React, { useCallback, useContext } from 'react';
import { MediaCache } from 'react-native-theoplayer';
import { MenuRadioButton } from '@theoplayer/react-native-ui';

export const MediaCacheDownloadButton = () => {
  const { player } = useContext(PlayerContext);

  const onPress = useCallback(() => {
    const currentSource = player?.source;
    if (currentSource) {
      void MediaCache.createTask(currentSource, {
        amount: '100%',
        expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        allowsCellularAccess: true,
        bandwidth: 2000000,
        preferredTrackSelection: {
          audioTrackSelection: ['en-US'],
          textTrackSelection: ['en-US'],
        },
      });
    }
  }, [player]);

  return <MenuRadioButton label={'Create download task'} uid={0} onSelect={onPress} />;
};
