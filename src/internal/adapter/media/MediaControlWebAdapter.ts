import { MediaControlAction, MediaControlAPI, MediaControlHandler } from 'react-native-theoplayer';
import { WebMediaSession } from '../web/WebMediaSession';

export class MediaControlWebAdapter implements MediaControlAPI {
  private handlers: Map<MediaControlAction, MediaControlHandler> = new Map();

  constructor(private readonly mediaSession: WebMediaSession) {}

  setHandler(action: MediaControlAction, handler: MediaControlHandler): void {
    this.handlers.set(action, handler);
    this.mediaSession.updateMediaSession();
  }

  hasHandler(action: MediaControlAction): boolean {
    return this.handlers.has(action);
  }

  getHandler(action: MediaControlAction): MediaControlHandler | undefined {
    return this.handlers.get(action);
  }
}
