import { MediaControlAction, MediaControlAPI, MediaControlHandler } from 'react-native-theoplayer';
import { WebMediaSession } from '../web/WebMediaSession';

export class MediaControlWebAdapter implements MediaControlAPI {
  private handlers: Map<MediaControlAction, MediaControlHandler> = new Map();

  constructor(private readonly mediaSession: WebMediaSession) {}

  setHandler(action: MediaControlAction, handler: MediaControlHandler | undefined): void {
    if (handler === undefined) {
      this.handlers.delete(action);
    } else {
      this.handlers.set(action, handler);
    }
    this.mediaSession.updateMediaSession();
  }

  /**
   * @internal Used by {@link WebMediaSession} to dispatch a media session action to the user's handler.
   */
  getHandler(action: MediaControlAction): MediaControlHandler | undefined {
    return this.handlers.get(action);
  }

  setEnabled(enabled: boolean): void {
    this.mediaSession.setEnabled(enabled);
  }
}
