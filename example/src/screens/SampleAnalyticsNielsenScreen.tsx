import * as React from 'react';
import { useState } from 'react';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { useNielsen } from '@theoplayer/react-native-analytics-nielsen';
import { NIELSEN_APP_ID, NIELSEN_OPTIONS, THEO_LICENSE } from '../sampleConfig';
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

const LOG_TAG = '[EXAMPLE - ANALYTICS NIELSEN SAMPLE]';
const playerConfig: PlayerConfiguration = {
  license: THEO_LICENSE,
  libraryLocation: 'theoplayer',
};

export const SampleAnalyticsNielsenScreen = () => {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [, initNielsen] = useNielsen(NIELSEN_APP_ID, 'THEOplayer demo', NIELSEN_OPTIONS);

  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);
    setPlayer(player);

    // initialize Comscore connector, by passing player instance
    if (NIELSEN_APP_ID === '<YOUR_NIELSEN_APP_ID>') {
      console.warn(LOG_TAG, 'Setup a correct configuration to activate Nielsen analytics support.');
    } else {
      initNielsen(player);
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
