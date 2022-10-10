import type { GoogleDAI } from 'react-native-theoplayer';
import type { GoogleDAI as NativeGoogleDAI } from 'theoplayer';

export class THEOplayerWebGoogleDAI implements GoogleDAI {
  public constructor(private readonly _googleDAI: NativeGoogleDAI) {}

  get snapback(): Promise<boolean> {
    return Promise.resolve(this._googleDAI.snapback);
  }

  setSnapback(enabled: boolean): void {
    this._googleDAI.snapback = enabled;
  }

  contentTimeForStreamTime(time: number): Promise<number> {
    return Promise.resolve(this._googleDAI.contentTimeForStreamTime(time));
  }

  streamTimeForContentTime(time: number): Promise<number> {
    return Promise.resolve(this._googleDAI.streamTimeForContentTime(time));
  }
}
