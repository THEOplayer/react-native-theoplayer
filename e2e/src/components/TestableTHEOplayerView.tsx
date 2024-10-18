import { useCavy } from 'cavy';
import { THEOplayer, THEOplayerView, THEOplayerViewProps } from 'react-native-theoplayer';
import React, { useCallback } from 'react';
import { PromiseController } from '../utils/PromiseController';

let playerController = new PromiseController<THEOplayer>();

export const getTestPlayer = async (): Promise<THEOplayer> => {
  return playerController.promise_;
};

export const TestableTHEOplayerView = (props: THEOplayerViewProps) => {
  const generateTestHook = useCavy();
  const onPlayerReady = useCallback((player: THEOplayer) => {
    playerController.resolve_(player);
    props.onPlayerReady?.(player);
  }, []);

  const onPlayerDestroy = useCallback(() => {
    playerController = new PromiseController<THEOplayer>();
  }, []);

  return <THEOplayerView ref={generateTestHook('Scene.THEOplayerView')} {...props} onPlayerReady={onPlayerReady} onPlayerDestroy={onPlayerDestroy} />;
};
