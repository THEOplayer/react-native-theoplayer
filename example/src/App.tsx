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
import { PlayerConfiguration, PlayerEventType, PresentationMode, THEOplayer, THEOplayerView } from 'react-native-theoplayer';

import { useWindowDimensions, Modal, Platform, StyleSheet, Text, View, StatusBar } from 'react-native';
import { SourceMenuButton, SOURCES } from './custom/SourceMenuButton';
import { BackgroundAudioSubMenu } from './custom/BackgroundAudioSubMenu';
import { PiPSubMenu } from './custom/PipSubMenu';
import { MediaCacheDownloadButton } from './custom/MediaCacheDownloadButton';
import { MediaCacheMenuButton } from './custom/MediaCacheMenuButton';
import { MediaCachingTaskListSubMenu } from './custom/MediaCachingTaskListSubMenu';

import { PortalDestination, PortalOrigin } from '@alexzunik/rn-native-portals-reborn';

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
  },
};

/**
 * The example app demonstrates the use of the THEOplayerView with a custom UI using the provided UI components.
 * If you don't want to create a custom UI, you can just use the THEOplayerDefaultUi component instead.
 */
export default function App() {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [isFullScreenMode, setFullScreenModeState] = useState(false);
  const { height, width } = useWindowDimensions();
  const deviceWidth = width;
  const deviceHeight = height;

  const styles = StyleSheet.create({
    videoContainer: {
      width: '100%',
      aspectRatio: '16/9',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000000',
    },
    videoContainerFullscreen: {
      width: deviceWidth,
      height: deviceHeight,
    },
  });

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
    player.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, (event) => {
      console.log('TVL', 'Fullscreen', event.presentationMode);
      setFullScreenModeState(event.presentationMode === PresentationMode.fullscreen);
    });
    player.source = SOURCES[0].source;

    player.backgroundAudioConfiguration = { enabled: true };
    player.pipConfiguration = { startsAutomatically: true };
    console.log('THEOplayer is ready:', player.version);
  };

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
      <PortalOrigin destination={isFullScreenMode ? 'fullscreen' : null}>
        <View style={isFullScreenMode ? styles.videoContainerFullscreen : styles.videoContainer}>
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
                    </SettingsMenuButton>
                  </ControlBar>
                }
                center={<CenteredControlBar left={<SkipButton skip={-10} />} middle={<PlayButton />}
                                            right={<SkipButton skip={30} />} />}
                bottom={
                  <>
                    <ControlBar>
                      <SeekBar />
                    </ControlBar>
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
      </PortalOrigin>

      <Text style={{ color: '#ffffff' }}>This text should not go into fullscreen</Text>

      <Modal visible={isFullScreenMode}
             statusBarTranslucent={true}
             style={{ backgroundColor: '#000000', height: deviceHeight, width: deviceWidth }} animationType={'none'}>
        <PortalDestination name="fullscreen" />
      </Modal>
    </View>
  );
}
