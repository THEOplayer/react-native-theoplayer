import { TheoAdsAPI, Interstitial, type THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

const NativeTHEOAdsModule = NativeModules.THEORCTTHEOAdsModule;

export class THEOAdsNativeAdapter implements TheoAdsAPI {
  // @ts-ignore
  constructor(private _player: THEOplayerView) {}

  get currentInterstitials(): Promise<readonly Interstitial[]> {
    return NativeTHEOAdsModule.currentInterstitials(this._player.nativeHandle);
  }

  get scheduledInterstitials(): Promise<readonly Interstitial[]> {
    return NativeTHEOAdsModule.scheduledInterstitials(this._player.nativeHandle);
  }

  replaceAdTagParameters(adTagParameters?: Record<string, string>): void {
    NativeTHEOAdsModule.replaceAdTagParameters(this._player.nativeHandle, adTagParameters);
  }
}
