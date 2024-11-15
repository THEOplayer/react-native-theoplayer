import { useCavy } from 'cavy';
import { THEOplayer, THEOplayerView, THEOplayerViewProps } from 'react-native-theoplayer';
import React, { useCallback } from 'react';

let testPlayer: THEOplayer | undefined = undefined;

/**
 * Wait until the player is ready.
 *
 * @param timeout Delay after rejecting the player.
 * @param poll Delay before trying again.
 */
export const getTestPlayer = async (timeout = 5000, poll = 200): Promise<THEOplayer> => {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const checkPlayer = () => {
      setTimeout(() => {
        if (testPlayer) {
          // Player is ready.
          resolve(testPlayer);
        } else if (Date.now() - start > timeout) {
          // Too late.
          reject('Player not ready');
        } else {
          // Wait & try again.
          checkPlayer();
        }
      }, poll);
    };
    checkPlayer();
  });
};

export const TestableTHEOplayerView = (props: THEOplayerViewProps) => {
  const generateTestHook = useCavy();
  const onPlayerReady = useCallback((player: THEOplayer) => {
    testPlayer = player;
    props.onPlayerReady?.(player);
  }, []);

  const onPlayerDestroy = useCallback(() => {
    testPlayer = undefined;
  }, []);

  return <THEOplayerView ref={generateTestHook('Scene.THEOplayerView')} {...props} onPlayerReady={onPlayerReady} onPlayerDestroy={onPlayerDestroy} />;
};
