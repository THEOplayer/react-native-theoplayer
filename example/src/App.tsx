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
import {
  AdIntegrationKind,
  PlayerConfiguration,
  PlayerEventType,
  THEOplayer,
  THEOplayerView,
} from 'react-native-theoplayer';

import {
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { SourceMenuButton, SOURCES } from './custom/SourceMenuButton';
import { BackgroundAudioSubMenu } from './custom/BackgroundAudioSubMenu';
import { PiPSubMenu } from './custom/PipSubMenu';
import { MediaCacheDownloadButton } from './custom/MediaCacheDownloadButton';
import { MediaCacheMenuButton } from './custom/MediaCacheMenuButton';
import { MediaCachingTaskListSubMenu } from './custom/MediaCachingTaskListSubMenu';
import { RenderingTargetSubMenu } from './custom/RenderingTargetSubMenu';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  // Without a license, only demo sources hosted on '*.theoplayer.com' domains can be played.
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
  const chromeless = playerConfig?.chromeless ?? false;
  const onPlayerReady = (player: THEOplayer) => {
    setPlayer(player);
    // optional debug logs
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
    player.source = {
      "sources": [
        {
          "src": "https://livesim.dashif.org/livesim2/testpic4_8s/Manifest.mpd",
          "type": "application/dash+xml"
        }
      ]
    };

    player.backgroundAudioConfiguration = { enabled: true };
    player.pipConfiguration = { startsAutomatically: true };
    console.log('THEOplayer is ready:', player.version);
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

  const handleMidRoll = () => {
    player?.ads.schedule({
      integration: AdIntegrationKind.google_ima,
      sources: 'https://cdn.theoplayer.com/demos/ads/vast/dfp-preroll-no-skip.xml',
      timeOffset: Math.floor(player.currentTime / 1000.0),
    });
  };

  return (
    <SafeAreaView
      style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}
    >
      <View
        style={{ position: 'absolute', top: 150, left: 0, right: 0, zIndex: 2 }}
      >
        <Button
          color={'white'}
          title='start mid roll'
          onPress={() => handleMidRoll()}
        />
      </View>
      <View style={PLAYER_CONTAINER_STYLE}>
        <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
          {player !== undefined && chromeless && (
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
                  {/* {!Platform.isTV && (
                    <>
                      <AirplayButton />
                      <ChromecastButton />
                    </>
                  )} */}
                  <LanguageMenuButton />
                  <SettingsMenuButton>
                    {/*Note: quality selection is not available on iOS */}
                    <QualitySubMenu />
                    <PlaybackRateSubMenu />
                    <BackgroundAudioSubMenu />
                    <PiPSubMenu />
                    {Platform.OS === 'android' && <RenderingTargetSubMenu />}
                  </SettingsMenuButton>
                </ControlBar>
              }
              center={
                <CenteredControlBar
                  left={<SkipButton skip={-10} />}
                  middle={<PlayButton />}
                  right={<SkipButton skip={30} />}
                />
              }
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
