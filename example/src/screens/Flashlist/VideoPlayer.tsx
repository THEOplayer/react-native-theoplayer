import { PlayerConfiguration, PlayerEventType, SourceDescription, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { StyleProp, ViewStyle } from 'react-native';
import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { CenteredControlBar, CenteredDelayedActivityIndicator, DEFAULT_THEOPLAYER_THEME, PlayButton, UiContainer } from '@theoplayer/react-native-ui';
import { THEO_LICENSE } from '../../sampleConfig';

const LOG_TAG = '[EXAMPLE - FLASHLIST SAMPLE]';

const playerConfig: PlayerConfiguration = {
  license: THEO_LICENSE,
  chromeless: true,
  libraryLocation: 'theoplayer',
};

class PlayerId {
  private static current = -1;
  static generate = () => {
    PlayerId.current++;
    return PlayerId.current;
  };
}

export interface VideoPlayerProps {
  style?: StyleProp<ViewStyle>;
  source: SourceDescription | undefined;
  onPlayerReady: (playerRef: THEOplayer | undefined, playerId: number) => void;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const playerId = useRef<number>(0);
  const playerRef = useRef<THEOplayer | undefined>(undefined);

  // Update source
  useEffect(() => {
    if (playerRef.current) {
      // Optionally check if the source has changed, but this would be always the case while scrolling.
      console.log(LOG_TAG, `Player ${playerId.current} is updating its source...`);
      playerRef.current.source = props.source;

      // Notify the player we are using for this source.
      props.onPlayerReady(playerRef.current, playerId.current);
    }
  }, [props.source]);

  const chromeless = playerConfig?.chromeless ?? false;
  const onPlayerReady = useCallback(async (player: THEOplayer) => {
    playerRef.current = player;
    playerId.current = PlayerId.generate();
    console.log(LOG_TAG, `Player ${playerId.current} is ready.`);

    // Extra logging
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, () => {
      console.log(LOG_TAG, `Player ${playerId.current} now has a new source.`);
    });

    player.addEventListener(PlayerEventType.PROGRESS, () => {
      let bufferStart = 9999999999;
      let bufferEnd = 0;
      if (playerRef.current?.buffered !== undefined && playerRef.current.buffered.length > 0) {
        playerRef.current.buffered.forEach((range) => {
          if (range.start < bufferStart) {
            bufferStart = range.start;
          }
          if (range.end > bufferEnd) {
            bufferEnd = range.end;
          }
        });
        console.log(LOG_TAG, `Player ${playerId.current} buffer size is updated to ${(bufferEnd - bufferStart) / 1000} sec`);
      }
    });

    // Restart source when ended.
    player.addEventListener(PlayerEventType.ENDED, () => {
      player.currentTime = 0;
      player.play();
    });

    // Setup player
    player.preload = 'auto';
    player.muted = true;
    console.log(LOG_TAG, `Player ${playerId.current} is getting its initial source...`);
    player.source = props.source;
    player.backgroundAudioConfiguration = { enabled: false };
    player.pipConfiguration = { startsAutomatically: false };

    // Notify the player we are using for this source.
    props.onPlayerReady(playerRef.current, playerId.current);
  }, []);

  const onPlayerDestroy = useCallback(() => {
    console.log(LOG_TAG, `Player ${playerId.current} is destroyed.`);
  }, []);

  return (
    <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady} onPlayerDestroy={onPlayerDestroy}>
      {playerRef.current !== undefined && !chromeless && (
        <UiContainer
          theme={{ ...DEFAULT_THEOPLAYER_THEME }}
          player={playerRef.current}
          behind={<CenteredDelayedActivityIndicator size={50} />}
          center={<CenteredControlBar middle={<PlayButton />} />}
        />
      )}
    </THEOplayerView>
  );
};

VideoPlayer.displayName = 'VideoPlayer';
