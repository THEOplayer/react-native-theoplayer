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

import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
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

    // setup debug logs
    player.addEventListener<PlayerEventType>(PlayerEventType.SOURCE_CHANGE, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.LOADED_DATA, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.LOADED_METADATA, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.READYSTATE_CHANGE, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.PLAY, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.PLAYING, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.PAUSE, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.SEEKING, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.SEEKED, console.log);
    player.addEventListener<PlayerEventType>(PlayerEventType.ENDED, console.log);

    // set initial source
    player.source = {
      sources: [
        {
          src: "https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8",
          type: "application/x-mpegurl"
        }
      ],
      textTracks: [
        {
          default: true,
          src: "https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/react-native-theoplayer/temp/test_sideloaded.webvtt",
          label: "testSubs",
          kind: "subtitles",
          format: "webvtt",
          srclang: "en"
        }
      ]
    };

    // enable the textTrack, based on language (required for iOS, where default:true setup is not supported yet)
      if (ttListEvent.subType === TrackListEventType.ADD_TRACK && ttListEvent.track.language === 'en') {
    player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, (ttListEvent: TextTrackListEvent) => {
        player.selectedTextTrack = ttListEvent.track.uid;
      }
    });

    // start playing
    player.play();
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
      <View style={styles.PLAYER_CONTAINER_STYLE}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  PLAYER_CONTAINER_STYLE: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
});
