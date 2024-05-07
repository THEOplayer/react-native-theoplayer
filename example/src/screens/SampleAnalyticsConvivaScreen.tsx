import * as React from 'react';
import { useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { useConviva, ConvivaMetadata } from '@theoplayer/react-native-analytics-conviva';
import { CONVIVA_CONFIG, CONVIVA_CUSTOMER_KEY, THEO_LICENSE } from '../sampleConfig';
import {
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  ControlBar,
  DEFAULT_THEOPLAYER_THEME,
  PlayButton,
  SeekBar,
  SkipButton,
  UiContainer,
} from '@theoplayer/react-native-ui';

const LOG_TAG = '[EXAMPLE - ANALYTICS CONVIVA SAMPLE]';
const playerConfig: PlayerConfiguration = {
  license: THEO_LICENSE,
  libraryLocation: 'theoplayer',
};

const convivaMetadata: ConvivaMetadata = {
  ['Conviva.applicationName']: 'THEOplayer',
  ['Conviva.viewerId']: 'your_viewer_id',
  ['customTag1']: 'customValue1',
};

export const SampleAnalyticsConvivaScreen = () => {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [, initConviva] = useConviva(convivaMetadata, CONVIVA_CONFIG);

  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);
    setPlayer(player);

    // initialize Comscore connector, by passing player instance
    if (CONVIVA_CUSTOMER_KEY === '<YOUR_CUSTOMER_KEY>') {
      console.warn(LOG_TAG, 'Setup a correct configuration to activate Conviva analytics support.');
    } else {
      initConviva(player);
    }

    // set a source
    player.source = {
      sources: [
        {
          src: 'https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8',
          type: 'application/x-mpegurl',
        },
      ],
      metadata: {
        title: 'My metadata title',
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
            bottom={
              <>
                {
                  /*Note: RNSlider is not available on tvOS */
                  !(Platform.isTV && Platform.OS === 'ios') && (
                    <ControlBar>
                      <SeekBar />
                    </ControlBar>
                  )
                }
              </>
            }
          />
        )}
      </THEOplayerView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  PLAYER_CONTAINER_STYLE: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
