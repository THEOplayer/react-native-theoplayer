import React, { useCallback, useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import ALL_SOURCES from '../../res/sources.json';

import { Platform, View } from 'react-native';
import styles from './VideoPlayer.style';
import { VideoPlayerUI } from './VideoPlayerUI';
import type { Source } from '../../utils/source/Source';

const SOURCES = ALL_SOURCES.filter((source) => source.os.indexOf(Platform.OS) >= 0);

export interface VideoPlayerProps {
  config?: PlayerConfiguration;
}

export function VideoPlayer(props: VideoPlayerProps) {
  const [player, setPlayer] = useState<THEOplayer | null>();
  const onPlayerReady = useCallback(
    (player: THEOplayer) => {
      setPlayer(player);
    },
    [player],
  );

  const chromeless = props.config?.chromeless ?? false;

  return (
    <View style={styles.container}>
      <THEOplayerView config={props.config} style={styles.fullScreen} onPlayerReady={onPlayerReady} />

      {chromeless && player && <VideoPlayerUI sources={SOURCES as Source[]} player={player} />}
    </View>
  );
}
