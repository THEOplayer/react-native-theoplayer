import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import {
  AirplayButton,
  AutoFocusGuide,
  CastMessage,
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  ChromecastButton,
  ControlBar,
  DEFAULT_THEOPLAYER_THEME,
  FullscreenButton,
  GoToLiveButton,
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
  ContentProtectionRegistry,
  PlayerConfiguration,
  PlayerEventType,
  PresentationMode,
  sdkVersions,
  TheoAdsEvent,
  TheoAdsEventType,
  THEOplayer,
  THEOplayerView,
} from 'react-native-theoplayer';
import { Platform, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SourceMenuButton, SOURCES } from './custom/SourceMenuButton';
import { BackgroundAudioSubMenu } from './custom/BackgroundAudioSubMenu';
import { PiPSubMenu } from './custom/PipSubMenu';
import { MediaCacheDownloadButton } from './custom/MediaCacheDownloadButton';
import { MediaCacheMenuButton } from './custom/MediaCacheMenuButton';
import { MediaCachingTaskListSubMenu } from './custom/MediaCachingTaskListSubMenu';
import { RenderingTargetSubMenu } from './custom/RenderingTargetSubMenu';
import { AutoPlaySubMenu } from './custom/AutoPlaySubMenu';
import { SafeAreaProvider, SafeAreaView, Edges } from 'react-native-safe-area-context';
import { usePresentationMode } from './hooks/usePresentationMode';
import {
  EzdrmFairplayContentProtectionIntegrationFactory,
  KeyOSDrmFairplayContentProtectionIntegrationFactory,
  KeyOSDrmWidevineContentProtectionIntegrationFactory,
} from '@theoplayer/react-native-drm';

// Register Ezdrm Fairplay integration
ContentProtectionRegistry.registerContentProtectionIntegration('customEzdrm', 'fairplay', new EzdrmFairplayContentProtectionIntegrationFactory());

// Register keyOS integration
ContentProtectionRegistry.registerContentProtectionIntegration('keyos_buydrm', 'fairplay', new KeyOSDrmFairplayContentProtectionIntegrationFactory());
ContentProtectionRegistry.registerContentProtectionIntegration('keyos_buydrm', 'widevine', new KeyOSDrmWidevineContentProtectionIntegrationFactory());

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
    allowLivePlayPause: true,
    seekToLiveOnResume: true,
  },
  ads: {
    theoads: true,
  },
};

/**
 * The example app demonstrates the use of the THEOplayerView with a custom UI using the provided UI components.
 * If you don't want to create a custom UI, you can just use the THEOplayerDefaultUi component instead.
 */
export default function App() {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const presentationMode = usePresentationMode(player);
  const isDarkMode = useColorScheme() === 'dark';

  // In PiP presentation mode on NewArch Android, there is an issue where SafeAreayView does not update the edges in time,
  // so explicitly disable them here.
  const edges: Edges = useMemo(() => (presentationMode === PresentationMode.pip ? [] : ['left', 'top', 'right', 'bottom']), [presentationMode]);

  const onTheoAdsEvent = (event: TheoAdsEvent) => {
    console.log(event);
    if (event.subType === TheoAdsEventType.ADD_INTERSTITIAL) {
      event.interstitial.adTagParameters['CustomKey'] = 'CustomValue';
    }
  };

  const onPlayerReady = useCallback((player: THEOplayer) => {
    setPlayer(player);
    // optional debug logs
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, console.log);
    player.addEventListener(PlayerEventType.LOADED_DATA, console.log);
    player.addEventListener(PlayerEventType.LOADED_METADATA, console.log);
    player.addEventListener(PlayerEventType.READYSTATE_CHANGE, console.log);
    player.addEventListener(PlayerEventType.PLAY, console.log);
    player.addEventListener(PlayerEventType.PLAYING, console.log);
    player.addEventListener(PlayerEventType.WAITING, console.log);
    player.addEventListener(PlayerEventType.PAUSE, console.log);
    player.addEventListener(PlayerEventType.SEEKING, console.log);
    player.addEventListener(PlayerEventType.SEEKED, console.log);
    player.addEventListener(PlayerEventType.ENDED, console.log);
    player.addEventListener(PlayerEventType.ERROR, console.log);
    player.addEventListener(PlayerEventType.THEOLIVE_EVENT, console.log);
    player.addEventListener(PlayerEventType.THEOADS_EVENT, onTheoAdsEvent);

    sdkVersions().then((versions) => console.log(`[theoplayer] ${JSON.stringify(versions, null, 4)}`));

    player.autoplay = true;
    player.source = SOURCES[0].source;

    player.backgroundAudioConfiguration = {
      enabled: true,
      shouldResumeAfterInterruption: true,
      stopOnBackground: false,
    };
    player.pipConfiguration = {
      startsAutomatically: true,
      reparentPip: true,
      retainPipOnSourceChange: true,
    };

    console.log('THEOplayer is ready');
  }, []);

  return (
    /**
     * The SafeAreaProvider component is a View from where insets provided by consumers are relative to.
     * This means that if this view overlaps with any system elements (status bar, notches, etc.) these values will be provided to
     * descendent consumers such as SafeAreaView.
     * {@link https://appandflow.github.io/react-native-safe-area-context/api/safe-area-provider}
     */
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={styles.container}>
          <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
            {player !== undefined && (
              <UiContainer
                theme={{ ...DEFAULT_THEOPLAYER_THEME }}
                player={player}
                behind={<CenteredDelayedActivityIndicator size={50} />}
                top={
                  <AutoFocusGuide>
                    <ControlBar>
                      <Spacer />
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
                  </AutoFocusGuide>
                }
                center={
                  <AutoFocusGuide>
                    <CenteredControlBar left={<SkipButton skip={-10} />} middle={<PlayButton />} right={<SkipButton skip={30} />} />
                  </AutoFocusGuide>
                }
                bottom={
                  <AutoFocusGuide>
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
                      <GoToLiveButton />
                      <TimeLabel showDuration={true} />
                      <Spacer />
                      <PipButton />
                      <FullscreenButton />
                    </ControlBar>
                  </AutoFocusGuide>
                }
                adCenter={
                  <AutoFocusGuide>
                    <CenteredControlBar middle={<PlayButton />} />
                  </AutoFocusGuide>
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
    // on iOS we cannot stretch an inline playerView to cover the whole screen, otherwise it assumes fullscreen presentationMode.
    marginHorizontal: Platform.select({ ios: 2, default: 0 }),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
