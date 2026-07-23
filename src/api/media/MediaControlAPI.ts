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

  /**
   * Enables or disables the media session for this player instance at runtime.
   *
   * @remarks
   * <br/> - This overrides the {@link MediaControlConfiguration.mediaSessionEnabled} value passed at creation time.
   * <br/> - When multiple players are active, this can be used to designate a single "active" player that publishes
   * media metadata (e.g. Now Playing info) and responds to remote control commands, while disabling the others.
   *
   * @param enabled Whether the media session should be enabled for this player.
   */
  setEnabled(enabled: boolean): void;
}
