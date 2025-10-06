import { NativeModules } from 'react-native';
import { Interstitial, TheoAdsAPI, type THEOplayerView } from 'react-native-theoplayer';
import { TheoAdsEventMap } from '../../../api/theoads/TheoAdsEventMap';
import { DefaultEventDispatcher } from '../event/DefaultEventDispatcher';
import { createNativeInterstitial } from './NativeInterstitialAdapter';

const NativeTHEOAdsModule = NativeModules.THEORCTTHEOAdsModule;

export class THEOAdsNativeAdapter extends DefaultEventDispatcher<TheoAdsEventMap> implements TheoAdsAPI {
  // @ts-ignore
  constructor(private _player: THEOplayerView) {
    super();
  }

  get currentInterstitials(): Promise<readonly Interstitial[]> {
    return this.getCurrentInterstitials();
  }

  get scheduledInterstitials(): Promise<readonly Interstitial[]> {
    return this.getScheduledInterstitials();
  }

  async getCurrentInterstitials(): Promise<readonly Interstitial[]> {
    const interstitials: Interstitial[] = await NativeTHEOAdsModule.currentInterstitials(this._player.nativeHandle);
    return interstitials.map(createNativeInterstitial);
  }

  async getScheduledInterstitials(): Promise<readonly Interstitial[]> {
    const interstitials: Interstitial[] = await NativeTHEOAdsModule.scheduledInterstitials(this._player.nativeHandle);
    return interstitials.map(createNativeInterstitial);
  }

  replaceAdTagParameters(adTagParameters?: Record<string, string>): void {
    NativeTHEOAdsModule.replaceAdTagParameters(this._player.nativeHandle, adTagParameters);
  }
}
