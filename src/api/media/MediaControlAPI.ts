import { THEOplayer } from 'react-native-theoplayer';

export type MediaControlHandler = (player: THEOplayer) => void;

export enum MediaControlAction {
  PLAY = 'play',
  PAUSE = 'pause',
  SKIP_TO_PREVIOUS = 'skipToPrevious',
  SKIP_TO_NEXT = 'skipToNext',
}

export interface MediaControlAPI {
  /**
   * Sets a handler for a media control action.
   *
   * @param action The media control action to set the handler for.
   * @param handler The handler function that will be called when the specified media control action is triggered. The handler receives the THEOplayer instance as an argument.
   */
  setHandler(action: MediaControlAction, handler: MediaControlHandler): void;
}
