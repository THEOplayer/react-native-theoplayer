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
import * as React from 'react';
import { useState } from 'react';
import env from 'react-native-config';
import {
  MediaTrackType,
  PlayerConfiguration,
  PlayerEventType,
  sdkVersions,
  THEOplayer,
  THEOplayerView,
  TrackListEventType,
} from 'react-native-theoplayer';

import { Platform, Pressable, SafeAreaView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { AutoPlaySubMenu } from './custom/AutoPlaySubMenu';
import { BackgroundAudioSubMenu } from './custom/BackgroundAudioSubMenu';
import { MediaCacheDownloadButton } from './custom/MediaCacheDownloadButton';
import { MediaCacheMenuButton } from './custom/MediaCacheMenuButton';
import { MediaCachingTaskListSubMenu } from './custom/MediaCachingTaskListSubMenu';
import { PiPSubMenu } from './custom/PipSubMenu';
import { RenderingTargetSubMenu } from './custom/RenderingTargetSubMenu';
import { SourceMenuButton, SOURCES } from './custom/SourceMenuButton';

const { THEOPLAYER_KEY } = env;

console.debug({ THEOPLAYER_KEY, env });

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  // Without a license, only demo sources hosted on '*.theoplayer.com' domains can be played.
  license: THEOPLAYER_KEY,
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

type Quality = {
  bandwidth: number;
  codecs: string;
  frameRate: number;
  height: number;
  id: string;
  name: string;
  uid: number;
  width: number;
};

/**
 * The example app demonstrates the use of the THEOplayerView with a custom UI using the provided UI components.
 * If you don't want to create a custom UI, you can just use the THEOplayerDefaultUi component instead.
 */
export default function App() {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [useLowBitrate, setUseLowBitrate] = useState(true);
  const [lowestQuality, setLowestQuality] = useState<Quality | null>(null);

  const onMediaTrackList = React.useCallback((e: any) => {
    if (e?.subType === TrackListEventType.ADD_TRACK && e?.trackType === MediaTrackType.VIDEO) {
      setLowestQuality(
        e?.track.qualities.reduce((lowest: Quality, next: Quality) => {
          if (lowest.bandwidth < next.bandwidth) {
            return lowest;
          }
          return next;
        }),
      );
    }
  }, []);

  React.useEffect(() => {
    if (player?.abr && lowestQuality) {
      if (useLowBitrate) {
        // set low bitrate
        console.debug('Setting quality to', { lowestQuality });
        player.targetVideoQuality = lowestQuality.uid;
      } else {
        // set high bitrate
        console.debug('Setting quality to max');
        player.targetVideoQuality = undefined;
      }
    }
  }, [useLowBitrate]);

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
    player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, onMediaTrackList);

    sdkVersions().then((versions) => console.log(`[theoplayer] ${JSON.stringify(versions, null, 4)}`));

    player.source = SOURCES[0].source;

    player.backgroundAudioConfiguration = { enabled: true, shouldResumeAfterInterruption: true };
    player.pipConfiguration = { startsAutomatically: true };

    console.log('THEOplayer is ready');
  };

  const needsBorder = true;
  const PLAYER_CONTAINER_STYLE: ViewStyle = {
    position: 'absolute',
    top: 100 + (needsBorder ? getStatusBarHeight() : 0),
    left: needsBorder ? 2 : 0,
    bottom: 100,
    right: needsBorder ? 2 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  };

  return (
    <SafeAreaView style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
      <Pressable
        style={{ position: 'absolute', top: 50, borderStyle: 'solid', borderColor: 'white', borderWidth: 1 }}
        onPress={() => setUseLowBitrate((x) => !x)}>
        <Text style={{ color: 'white' }}>{useLowBitrate ? 'Set high quality' : 'Set low quality'}</Text>
      </Pressable>
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
