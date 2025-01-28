import * as React from 'react';
import { useState } from 'react';
import {
  AirplayButton,
  CastMessage,
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  ChromecastButton,
  ControlBar,
  DEFAULT_THEOPLAYER_THEME,
  FullscreenButton,
  LanguageMenuButton,
  MuteButton,
  PipButton,
  PlaybackRateSubMenu,
  PlayButton,
  QualitySubMenu,
  SeekBar,
  SettingsMenuButton,
  SkipButton,
  Spacer,
  TimeLabel,
  UiContainer,
} from '@theoplayer/react-native-ui';
import { PlayerConfiguration, PlayerEventType, THEOplayer, THEOplayerView, sdkVersions, Event } from 'react-native-theoplayer';

import { Platform, SafeAreaView, StyleSheet, View, ViewStyle } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SourceMenuButton, SOURCES } from './custom/SourceMenuButton';
import { BackgroundAudioSubMenu } from './custom/BackgroundAudioSubMenu';
import { PiPSubMenu } from './custom/PipSubMenu';
import { MediaCacheDownloadButton } from './custom/MediaCacheDownloadButton';
import { MediaCacheMenuButton } from './custom/MediaCacheMenuButton';
import { MediaCachingTaskListSubMenu } from './custom/MediaCachingTaskListSubMenu';
import { RenderingTargetSubMenu } from './custom/RenderingTargetSubMenu';
import { AutoPlaySubMenu } from './custom/AutoPlaySubMenu';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  // Without a license, only demo sources hosted on '*.theoplayer.com' domains can be played.
  license: undefined,
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
    skipBackwardInterval: 10,
    convertSkipToSeek: true,
  },
};

/**
 * The example app demonstrates the use of the THEOplayerView with a custom UI using the provided UI components.
 * If you don't want to create a custom UI, you can just use the THEOplayerDefaultUi component instead.
 */
export default function App() {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);

  const onPlayerReady = (player: THEOplayer) => {
    // set player
    setPlayer(player);
    attachListeners(player);

    // print versions
    sdkVersions().then((versions) => console.log(`[theoplayer] ${JSON.stringify(versions, null, 4)}`));

    // set source
    player.source = SOURCES[0].source;

    // configure features
    player.backgroundAudioConfiguration = { enabled: true, shouldResumeAfterInterruption: true };
    player.pipConfiguration = { startsAutomatically: true };

    console.log('THEOplayer is ready');
  };

  const logEvent = (e: Event<PlayerEventType>) => {
    console.log(`[EVENT] ${e.type.toUpperCase()}: `, e);
  };

  const attachListeners = (player: THEOplayer) => {
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, logEvent);
    player.addEventListener(PlayerEventType.LOADED_DATA, logEvent);
    player.addEventListener(PlayerEventType.LOADED_METADATA, logEvent);
    player.addEventListener(PlayerEventType.READYSTATE_CHANGE, logEvent);
    player.addEventListener(PlayerEventType.WAITING, logEvent);
    player.addEventListener(PlayerEventType.CANPLAY, logEvent);
    player.addEventListener(PlayerEventType.PLAY, logEvent);
    player.addEventListener(PlayerEventType.PLAYING, logEvent);
    player.addEventListener(PlayerEventType.PAUSE, logEvent);
    player.addEventListener(PlayerEventType.SEEKING, logEvent);
    player.addEventListener(PlayerEventType.SEEKED, logEvent);
    player.addEventListener(PlayerEventType.ENDED, logEvent);
    player.addEventListener(PlayerEventType.VOLUME_CHANGE, logEvent);
    player.addEventListener(PlayerEventType.DURATION_CHANGE, logEvent);
    player.addEventListener(PlayerEventType.ERROR, logEvent);
    player.addEventListener(PlayerEventType.RATE_CHANGE, logEvent);
    player.addEventListener(PlayerEventType.RESIZE, logEvent);
    player.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, logEvent);
    player.addEventListener(PlayerEventType.TEXT_TRACK_LIST, logEvent);
    player.addEventListener(PlayerEventType.TEXT_TRACK, logEvent);
    player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, logEvent);
    player.addEventListener(PlayerEventType.MEDIA_TRACK, logEvent);
    player.addEventListener(PlayerEventType.CAST_EVENT, logEvent);
    player.addEventListener(PlayerEventType.AD_EVENT, logEvent);
    //player.addEventListener(PlayerEventType.PROGRESS, logEvent);
    //player.addEventListener(PlayerEventType.TIME_UPDATE, logEvent);
  };

  const needsBorder = Platform.OS === 'ios';
  const PLAYER_CONTAINER_STYLE: ViewStyle = {
    position: 'absolute',
    top: needsBorder ? getStatusBarHeight() : 0,
    left: needsBorder ? 2 : 0,
    bottom: 0,
    right: needsBorder ? 2 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
      <View style={PLAYER_CONTAINER_STYLE}>
        <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
          {player !== undefined && (
            <UiContainer
              theme={{ ...DEFAULT_THEOPLAYER_THEME }}
              player={player}
              behind={<CenteredDelayedActivityIndicator size={50} />}
              top={
                <ControlBar>
                  <MediaCacheMenuButton>
                    <MediaCacheDownloadButton />
                    <MediaCachingTaskListSubMenu />
                  </MediaCacheMenuButton>
                  {/*This is a custom menu for source selection.*/}
                  <SourceMenuButton />
                  {!Platform.isTV && (
                    <>
                      <AirplayButton />
                      <ChromecastButton />
                    </>
                  )}
                  <LanguageMenuButton />
                  <SettingsMenuButton>
                    {/*Note: quality selection is not available on iOS */}
                    <QualitySubMenu />
                    <PlaybackRateSubMenu />
                    <BackgroundAudioSubMenu />
                    <PiPSubMenu />
                    <AutoPlaySubMenu />
                    {Platform.OS === 'android' && <RenderingTargetSubMenu />}
                  </SettingsMenuButton>
                </ControlBar>
              }
              center={<CenteredControlBar left={<SkipButton skip={-10} />} middle={<PlayButton />} right={<SkipButton skip={30} />} />}
              bottom={
                <>
                  <ControlBar style={{ justifyContent: 'flex-start' }}>
                    <CastMessage />
                  </ControlBar>
                  {
                    /*Note: RNSlider is not available on tvOS */
                    !(Platform.isTV && Platform.OS === 'ios') && (
                      <ControlBar>
                        <SeekBar />
                      </ControlBar>
                    )
                  }
                  <ControlBar>
                    <MuteButton />
                    <TimeLabel showDuration={true} />
                    <Spacer />
                    <PipButton />
                    <FullscreenButton />
                  </ControlBar>
                </>
              }
            />
          )}
        </THEOplayerView>
      </View>
    </SafeAreaView>
  );
}
