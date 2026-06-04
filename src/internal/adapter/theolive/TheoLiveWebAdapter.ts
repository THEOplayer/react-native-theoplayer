import type { HespLatencies, TheoLiveAPI } from 'react-native-theoplayer';
import type { ChromelessPlayer } from 'theoplayer';

export class TheoLiveWebAdapter implements TheoLiveAPI {
  constructor(private _player: ChromelessPlayer) {}

  get currentLatency(): Promise<number> {
    const currentLatency = this._player.latency.currentLatency;
    return currentLatency ? Promise.resolve(currentLatency) : Promise.reject<number>('latency not available');
  }

  get latencies(): Promise<HespLatencies> {
    console.warn('The THEOlive latencies metrics are not available');
    return Promise.resolve({});
  }

  set authToken(token: string) {
    if (this._player.theoLive) {
      this._player.theoLive.authToken = token;
    }
  }

  get authToken(): string | undefined {
    return this._player.theoLive?.authToken;
  }
}
