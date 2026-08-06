import type { MetricsAPI } from 'react-native-theoplayer';
import type { ChromelessPlayer } from 'theoplayer';

export class THEOplayerWebMetricsAdapter implements MetricsAPI {
  private readonly _player: ChromelessPlayer;

  constructor(player: ChromelessPlayer) {
    this._player = player;
  }

  currentBandwidthEstimate(): Promise<number> {
    return Promise.resolve(this._player.metrics?.currentBandwidthEstimate ?? 0);
  }
}
