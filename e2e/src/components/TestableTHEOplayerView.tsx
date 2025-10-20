import { useCavy } from 'cavy';
import { THEOplayer, THEOplayerView, THEOplayerViewProps } from 'react-native-theoplayer';
import React, { useCallback } from 'react';

let testPlayer: THEOplayer | undefined = undefined;
let testPlayerId: number = 0;

/**
 * Wait until the player is ready.
 *
 * @param timeout Delay after rejecting the player.
 * @param poll Delay before trying again.
 */
export const getTestPlayer = async (timeout = 20_000, poll = 1_000): Promise<THEOplayer> => {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const checkPlayer = () => {
      setTimeout(() => {
        if (testPlayer) {
          // Player is ready.
          console.debug(`[checkPlayer] Success: player ${testPlayerId} ready.`);
          resolve(testPlayer);
        } else if (Date.now() - start > timeout) {
          // Too late.
          console.debug(`[checkPlayer] Failed: timeout reached for ${testPlayerId}.`);
          reject('Player not ready');
        } else {
          // Wait & try again.
          console.debug(`[checkPlayer] Player ${testPlayerId} not ready yet. Retrying...`);
          checkPlayer();
        }
      }, poll);
    };
    checkPlayer();
  });
};

export const TestableTHEOplayerView = ({ onPlayerReady, ...props }: THEOplayerViewProps) => {
  const generateTestHook = useCavy();
  const onPlayerReadyCallback = useCallback(
    (player: THEOplayer) => {
      testPlayerId++;
      testPlayer = player;
      console.debug(`[onPlayerReady] id: ${testPlayerId}`);
      onPlayerReady?.(player);
    },
    [onPlayerReady],
  );

  const onPlayerDestroy = useCallback(() => {
    console.debug(`[onPlayerDestroy] id: ${testPlayerId}`);
    testPlayer = undefined;
  }, []);

  return (
    <THEOplayerView
      ref={generateTestHook('Scene.THEOplayerView')}
      {...props}
      onPlayerReady={onPlayerReadyCallback}
      onPlayerDestroy={onPlayerDestroy}
    />
  );
};
