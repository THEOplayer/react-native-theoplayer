import type { HespLatencies, TheoLiveAPI } from 'react-native-theoplayer';
import type { ChromelessPlayer } from 'theoplayer';

export class TheoLiveWebAdapter implements TheoLiveAPI {
  constructor(private _player: ChromelessPlayer) {}

  currentLatency(): Promise<number> {
    const currentLatency = this._player.latency.currentLatency;
    return currentLatency ? Promise.resolve(currentLatency) : Promise.reject<number>('latency not available');
  }

  latencies(): Promise<HespLatencies> {
    const webLatencies = this._player.hesp?.latencies;
    if (webLatencies) {
      return Promise.resolve({
        engineLatency: webLatencies?.engine,
        distributionLatency: webLatencies?.distribution,
        playerLatency: webLatencies?.player,
        theoliveLatency: webLatencies?.theolive,
      });
    } else {
      return Promise.reject<HespLatencies>('latencies not available');
    }
  }
}
