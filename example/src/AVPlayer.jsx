/* eslint-disable react/display-name */
import { forwardRef } from 'react';
import * as React from 'react';
import { PlayerEventType, THEOplayerView } from 'react-native-theoplayer';
import { View } from 'react-native';
import { PortalOrigin } from '@alexzunik/rn-native-portals-reborn';
import { SOURCES } from './custom/SourceMenuButton';

let _playerClient = null;
export const getPlayerClient = () => {
  return _playerClient;
};

const playerConfig = {
  license: undefined,
  chromeless: true,
  hlsDateRange: true,
  libraryLocation: 'theoplayer',
  cast: {
    chromecast: {
      appID: 'CC1AD845',
    },
    strategy: 'auto',
  },
  ui: {
    language: 'en',
  },
  mediaControl: {
    mediaSessionEnabled: true,
    skipForwardInterval: 30,
    skipBackwardInterval: 15,
    convertSkipToSeek: true,
  },
};

export default forwardRef((props, ref) => {
  const { setTheo, playerVisible } = props;

  const onPlayerReady = (player) => {
    setTheo(player);
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, console.log);
    player.addEventListener(PlayerEventType.LOADED_DATA, console.log);
    player.addEventListener(PlayerEventType.LOADED_METADATA, console.log);
    player.addEventListener(PlayerEventType.READYSTATE_CHANGE, console.log);
    player.addEventListener(PlayerEventType.PLAY, console.log);
    player.addEventListener(PlayerEventType.PLAYING, console.log);
    player.addEventListener(PlayerEventType.PAUSE, console.log);
    player.addEventListener(PlayerEventType.SEEKING, console.log);
    player.addEventListener(PlayerEventType.SEEKED, console.log);
    player.addEventListener(PlayerEventType.ENDED, console.log);

    player.backgroundAudioConfiguration = {
      enabled: true,
      shouldResumeAfterInterruption: true,
    };
    player.pipConfiguration = { startsAutomatically: false };
    player.keepScreenOn = false;
    player.preload = 'auto';
    SOURCES;
    player.source = SOURCES[0].source;
    console.log('THEOplayer is ready:', player.version);
  };

  return (
    <PortalOrigin destination={playerVisible ? 'fullscreenplayer' : null}>
      <View>
        <THEOplayerView
          ref={ref}
          config={playerConfig}
          onPlayerReady={onPlayerReady}
          style={{
            position: 'absolute',
            top: 0,
            height: 400,
            zIndex: 0,
            width: '99%',
          }}></THEOplayerView>
      </View>
    </PortalOrigin>
  );
});
