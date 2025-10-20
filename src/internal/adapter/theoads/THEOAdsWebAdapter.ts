import { Interstitial, TheoAdsAPI } from 'react-native-theoplayer';
import type { ChromelessPlayer } from 'theoplayer';

export class THEOAdsWebAdapter implements TheoAdsAPI {
  private readonly _player: ChromelessPlayer;

  constructor(player: ChromelessPlayer) {
    this._player = player;
  }

  get currentInterstitials(): Promise<readonly Interstitial[]> {
    return Promise.resolve(this._player.theoads?.currentInterstitials ?? []);
  }

  get scheduledInterstitials(): Promise<readonly Interstitial[]> {
    return Promise.resolve(this._player.theoads?.scheduledInterstitials ?? []);
  }

  replaceAdTagParameters(adTagParameters?: Record<string, string>): void {
    this._player.theoads?.replaceAdTagParameters(adTagParameters);
  }
}
