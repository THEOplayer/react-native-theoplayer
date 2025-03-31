import { TheoAdsAPI, Interstitial, type THEOplayerView } from 'react-native-theoplayer';

export class THEOAdsNativeAdapter implements TheoAdsAPI {
  // @ts-ignore
  constructor(private _player: THEOplayerView) {}

  get currentInterstitials(): Promise<readonly Interstitial[]> {
    // TODO
    //return NativeTHEOAdsModule.currentInterstitials(this._player.nativeHandle);
    console.warn('THEOAdsNativeAdapter', 'currentInterstitials - NYI');
    return Promise.resolve([]);
  }

  get scheduledInterstitials(): Promise<readonly Interstitial[]> {
    // TODO
    //return NativeTHEOAdsModule.scheduledInterstitials(this._player.nativeHandle);
    console.warn('THEOAdsNativeAdapter', 'scheduledInterstitials - NYI');
    return Promise.resolve([]);
  }

  replaceAdTagParameters(_adTagParameters?: Record<string, string>): void {
    //return NativeTHEOAdsModule.replaceAdTagParameters(this._player.nativeHandle);
    console.warn('THEOAdsNativeAdapter', 'replaceAdTagParameters - NYI');
    // TODO
  }
}
