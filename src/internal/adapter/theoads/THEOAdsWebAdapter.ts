import type { ChromelessPlayer } from 'theoplayer';
import { TheoAdsAPI, Interstitial } from 'react-native-theoplayer';
import { DefaultEventDispatcher } from '../event/DefaultEventDispatcher';
import { TheoAdsEventMap } from '../../../api/theoads/TheoAdsEventMap';

export class THEOAdsWebAdapter extends DefaultEventDispatcher<TheoAdsEventMap> implements TheoAdsAPI {
  private readonly _player: ChromelessPlayer;

  constructor(player: ChromelessPlayer) {
    super();
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
