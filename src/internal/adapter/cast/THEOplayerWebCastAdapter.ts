import type { Airplay, CastAPI, Chromecast } from 'react-native-theoplayer';
import type * as THEOplayer from 'theoplayer';

export class THEOplayerWebCastAdapter implements CastAPI {
  private readonly _player: THEOplayer.ChromelessPlayer;

  constructor(player: THEOplayer.ChromelessPlayer) {
    this._player = player;
  }

  get casting(): boolean {
    return this._player.cast?.casting ?? false;
  }

  get chromecast(): Chromecast | undefined {
    return this._player.cast?.chromecast as Chromecast | undefined;
  }

  get airplay(): Airplay | undefined {
    return this._player.cast?.airplay as Airplay | undefined;
  }
}
