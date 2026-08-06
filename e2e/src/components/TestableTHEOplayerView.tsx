import { TesterContext, useCavy } from 'react-native-cavynext';
import { THEOplayer, THEOplayerView, THEOplayerViewProps } from 'react-native-theoplayer';
import React, { useCallback, useContext, useLayoutEffect, useRef } from 'react';
import { PLAYER_HOOK_ID } from '../utils/Actions';
import { Log } from '../utils/Log';

/**
 * A THEOplayerView that registers both itself and its player in the cavynext
 * TestHookStore:
 *
 *   - 'Scene.THEOplayerView' - the view component;
 *   - PLAYER_HOOK_ID         - the THEOplayer instance, available from the
 *                              `onPlayerReady` callback until the player is
 *                              destroyed.
 *
 * Specs obtain the player via `getTestPlayer(spec)`, which waits for the hook
 * to appear using cavynext's regular component lookup.
 */
export const TestableTHEOplayerView = ({ onPlayerReady, onPlayerDestroy, ...props }: THEOplayerViewProps) => {
  const generateTestHook = useCavy();
  const store = useContext(TesterContext);
  // The player owned by this component instance, so an unmounting instance
  // can never unregister the player of its successor.
  const ownPlayer = useRef<THEOplayer | undefined>(undefined);

  const registerPlayer = useCallback(
    (player: THEOplayer) => {
      ownPlayer.current = player;
      store?.add(PLAYER_HOOK_ID, player as unknown as NonNullable<ReturnType<typeof store.get>>);
    },
    [store],
  );

  const unregisterPlayer = useCallback(() => {
    if (ownPlayer.current && store?.get(PLAYER_HOOK_ID) === (ownPlayer.current as unknown)) {
      store.remove(PLAYER_HOOK_ID);
    }
    ownPlayer.current = undefined;
  }, [store]);

  // Unregister synchronously when this view unmounts (layout effects clean up
  // during the React commit). The runner awaits the re-mount commit before a
  // test starts, so a test can never grab the previous, about-to-be-destroyed
  // player from the store; the player's own destroy callback fires later, in
  // a passive effect.
  useLayoutEffect(() => unregisterPlayer, [unregisterPlayer]);

  const onPlayerReadyCallback = useCallback(
    (player: THEOplayer) => {
      Log.debug('[TestableTHEOplayerView] onPlayerReady');
      registerPlayer(player);
      onPlayerReady?.(player);
    },
    [registerPlayer, onPlayerReady],
  );

  const onPlayerDestroyCallback = useCallback(
    (player: THEOplayer) => {
      Log.debug('[TestableTHEOplayerView] onPlayerDestroy');
      unregisterPlayer();
      onPlayerDestroy?.(player);
    },
    [unregisterPlayer, onPlayerDestroy],
  );

  return (
    <THEOplayerView
      ref={generateTestHook('Scene.THEOplayerView')}
      {...props}
      onPlayerReady={onPlayerReadyCallback}
      onPlayerDestroy={onPlayerDestroyCallback}
    />
  );
};
