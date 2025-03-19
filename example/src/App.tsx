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
import { PlayerConfiguration, PlayerEventType, THEOplayer, THEOplayerView, sdkVersions } from 'react-native-theoplayer';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SourceMenuButton, SOURCES } from './custom/SourceMenuButton';
import { BackgroundAudioSubMenu } from './custom/BackgroundAudioSubMenu';
import { PiPSubMenu } from './custom/PipSubMenu';
import { MediaCacheDownloadButton } from './custom/MediaCacheDownloadButton';
import { MediaCacheMenuButton } from './custom/MediaCacheMenuButton';
import { MediaCachingTaskListSubMenu } from './custom/MediaCachingTaskListSubMenu';
import { RenderingTargetSubMenu } from './custom/RenderingTargetSubMenu';
import { AutoPlaySubMenu } from './custom/AutoPlaySubMenu';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
  ads: {
    theoads: true,
  },
  useMedia3: true,
};

/**
 * The example app demonstrates the use of the THEOplayerView with a custom UI using the provided UI components.
 * If you don't want to create a custom UI, you can just use the THEOplayerDefaultUi component instead.
 */
export default function App() {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
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

    sdkVersions().then((versions) => console.log(`[theoplayer] ${JSON.stringify(versions, null, 4)}`));

    player.autoplay = true;
    player.source = SOURCES[0].source;

    player.backgroundAudioConfiguration = {
      enabled: true,
      shouldResumeAfterInterruption: true,
    };
    player.pipConfiguration = {
      startsAutomatically: true,
      retainPipOnSourceChange: true,
    };

    console.log('THEOplayer is ready');
  };

  return (
    /**
     * The SafeAreaProvider component is a View from where insets provided by consumers are relative to.
     * This means that if this view overlaps with any system elements (status bar, notches, etc.) these values will be provided to
     * descendent consumers such as SafeAreaView.
     * {@link https://appandflow.github.io/react-native-safe-area-context/api/safe-area-provider}
     */
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={styles.container}>
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
