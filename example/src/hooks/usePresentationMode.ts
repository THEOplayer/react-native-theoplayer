import { useCallback, useSyncExternalStore } from 'react';
import { PlayerEventType, PresentationMode, THEOplayer } from 'react-native-theoplayer';

/**
 * Returns {@link react-native-theoplayer!THEOplayer.presentationMode | the player's presentationMode}, automatically updating whenever it changes.
 */
export const usePresentationMode = (player?: THEOplayer) => {
  const subscribe = useCallback(
    (callback: () => void) => {
      player?.addEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, callback);
      return () => player?.removeEventListener(PlayerEventType.PRESENTATIONMODE_CHANGE, callback);
    },
    [player],
  );
  return useSyncExternalStore(subscribe, () => (player ? player.presentationMode : PresentationMode.inline));
};
