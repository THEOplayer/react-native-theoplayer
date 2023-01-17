import type { Airplay, CastAPI, Chromecast } from 'react-native-theoplayer';
import type { THEOplayerView } from '../THEOplayerView.web';

export class THEOplayerWebCastAPI implements CastAPI {
  // @ts-ignore
  constructor(private readonly _player: THEOplayerView) {}

  casting(): Promise<boolean> {
    return Promise.resolve(false);
  }

  get chromecast(): Chromecast | undefined {
    // TODO
    return undefined;
  }

  get airplay(): Airplay | undefined {
    // TODO
    return undefined;
  }
}
