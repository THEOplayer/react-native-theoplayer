import { TheoAdsAPI, Interstitial, type THEOplayerView } from 'react-native-theoplayer';

export class THEOAdsNativeAdapter implements TheoAdsAPI {
  // @ts-ignore
  constructor(private _player: THEOplayerView) {}

  get currentInterstitials(): readonly Interstitial[] {
    // TODO
    //return NativeTHEOAdsModule.currentInterstitials(this._player.nativeHandle);
    console.warn('THEOAdsNativeAdapter', 'currentInterstitials - NYI');
    return [];
  }

  get scheduledInterstitials(): readonly Interstitial[] {
    // TODO
    //return NativeTHEOAdsModule.scheduledInterstitials(this._player.nativeHandle);
    console.warn('THEOAdsNativeAdapter', 'scheduledInterstitials - NYI');
    return [];
  }

  replaceAdTagParameters(_adTagParameters?: Record<string, string>): void {
    //return NativeTHEOAdsModule.replaceAdTagParameters(this._player.nativeHandle);
    console.warn('THEOAdsNativeAdapter', 'replaceAdTagParameters - NYI');
    // TODO
  }
}
