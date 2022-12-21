import React, { PureComponent } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';

import { View } from 'react-native';
import styles from './VideoPlayer.style';
import { VideoPlayerUI } from './VideoPlayerUI';

export interface VideoPlayerProps {
  config?: PlayerConfiguration;
}

interface VideoPlayerState {
  player: THEOplayer | undefined;
}

export class VideoPlayer extends PureComponent<VideoPlayerProps, VideoPlayerState> {
  constructor(props: VideoPlayerProps) {
    super(props);
    this.state = { player: undefined };
  }

  private onPlayerReady = (player: THEOplayer) => {
    this.setState({ player });
  };

  render() {
    const { config } = this.props;
    const { player } = this.state;
    const chromeless = config?.chromeless ?? false;

    return (
      <View style={styles.container}>
        <THEOplayerView config={config} style={styles.fullScreen} onPlayerReady={this.onPlayerReady} />

        {chromeless && player && <VideoPlayerUI player={player} />}
      </View>
    );
  }
}
