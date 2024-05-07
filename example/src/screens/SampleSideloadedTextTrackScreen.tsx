import * as React from 'react';
import { useState } from 'react';
import {
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  DEFAULT_THEOPLAYER_THEME,
  PlayButton,
  SkipButton,
  UiContainer,
} from '@theoplayer/react-native-ui';
import { PlayerConfiguration, PlayerEventType, TextTrackListEvent, THEOplayer, THEOplayerView, TrackListEventType } from 'react-native-theoplayer';

import { SafeAreaView, StyleSheet } from 'react-native';
import { THEO_LICENSE } from '../sampleConfig';

const LOG_TAG = '[EXAMPLE - SIDELOADED TEXTTRACK SAMPLE]';

const playerConfig: PlayerConfiguration = {
  license: THEO_LICENSE,
  chromeless: true,
  libraryLocation: 'theoplayer',
};

export const SampleSideloadedTextTrackScreen = () => {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);

  const onPlayerReady = (player: THEOplayer) => {
    console.log(LOG_TAG, 'THEOplayer is ready:', player.version);

    // store player reference
    setPlayer(player);

    // set initial source
    player.source = {
      sources: [
        {
          src: 'https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8',
          type: 'application/x-mpegurl',
        },
      ],
      textTracks: [
        {
          default: true,
          src: 'https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/react-native-theoplayer/temp/test_sideloaded.webvtt',
          label: 'testSubs',
          kind: 'subtitles',
          format: 'webvtt',
          srclang: 'en',
        },
      ],
    };

    // enable the textTrack, based on language (required for iOS, where default:true setup is not supported yet)
    player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, (ttListEvent: TextTrackListEvent) => {
      if (ttListEvent.subType === TrackListEventType.ADD_TRACK && ttListEvent.track.language === 'en') {
        player.selectedTextTrack = ttListEvent.track.uid;
      }
    });

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
    backgroundColor: '#000000',
  },
});
