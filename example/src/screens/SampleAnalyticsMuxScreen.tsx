import * as React from 'react';
import { useState } from 'react';
import { PlayerConfiguration, PlayerEventType, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { SafeAreaView, StyleSheet } from 'react-native';
import { MuxOptions, useMux } from '@theoplayer/react-native-analytics-mux';
import { THEO_LICENSE, MUX_ENV_KEY } from '../sampleConfig';
import {
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  DEFAULT_THEOPLAYER_THEME,
  PlayButton,
  SkipButton,
  UiContainer,
} from '@theoplayer/react-native-ui';

const LOG_TAG = '[EXAMPLE - ANALYTICS MUX SAMPLE]';
const playerConfig: PlayerConfiguration = {
  license: THEO_LICENSE,
  libraryLocation: 'theoplayer',
};

const MUX_OPTIONS: MuxOptions = {
  debug: true,
  data: {
    env_key: MUX_ENV_KEY, // required
    // Site Metadata
    viewer_user_id: '12345',
    experiment_name: 'player_test_A',
    sub_property_id: 'cus-1',
    // Player Metadata
    player_name: 'My Main Player',
    player_version: '1.0.0',
    player_init_time: 1451606400000,
    // Video Metadata
    video_id: 'abcd123',
    video_title: 'My Great Video',
    video_series: 'Weekly Great Videos',
    video_duration: 12000, // in milliseconds
    video_stream_type: 'on-demand', // 'live' or 'on-demand'
    video_cdn: 'Akamai',
  },
};

export const SampleAnalyticsMuxScreen = () => {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [, initMux] = useMux(MUX_OPTIONS);

  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);
    setPlayer(player);

    // initialize Comscore connector, by passing player instance
    if (MUX_ENV_KEY === '<YOUR_ENV_KEY>') {
      console.warn(LOG_TAG, 'Setup a correct configuration to activate Conviva analytics support.');
    } else {
      initMux(player);
    }

    // set a source
    player.source = {
      sources: [
        {
          src: 'https://cdn.theoplayer.com/video/elephants-dream/playlist-single-audio.m3u8',
          type: 'application/x-mpegurl',
        },
      ],
      metadata: {
        title: 'My vod title',
      },
    };

    // start playing
    player.play();
  };

  return (
    <SafeAreaView style={styles.PLAYER_CONTAINER_STYLE}>
      <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
        {player !== undefined && (
          <UiContainer
            theme={{ ...DEFAULT_THEOPLAYER_THEME }}
            player={player}
            behind={<CenteredDelayedActivityIndicator size={50} />}
            center={<CenteredControlBar left={<SkipButton skip={-10} />} middle={<PlayButton />} right={<SkipButton skip={30} />} />}
          />
        )}
      </THEOplayerView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  PLAYER_CONTAINER_STYLE: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
