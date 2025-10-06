import { NativeModules } from 'react-native';
import { Interstitial, TheoAdsAPI, type THEOplayerView } from 'react-native-theoplayer';
import { createNativeInterstitial } from './NativeInterstitialAdapter';

const NativeTHEOAdsModule = NativeModules.THEORCTTHEOAdsModule;

export class THEOAdsNativeAdapter implements TheoAdsAPI {
  // @ts-ignore
  constructor(private _player: THEOplayerView) {}

  get currentInterstitials(): Promise<readonly Interstitial[]> {
    return this.getCurrentInterstitials();
  }

  get scheduledInterstitials(): Promise<readonly Interstitial[]> {
    return this.getScheduledInterstitials();
  }

  async getCurrentInterstitials(): Promise<readonly Interstitial[]> {
    const interstitials: Interstitial[] = await NativeTHEOAdsModule.currentInterstitials(this._player.nativeHandle);
    return interstitials.map((interstitial) => createNativeInterstitial(this._player.nativeHandle, interstitial));
  }

  async getScheduledInterstitials(): Promise<readonly Interstitial[]> {
    const interstitials: Interstitial[] = await NativeTHEOAdsModule.scheduledInterstitials(this._player.nativeHandle);
    return interstitials.map((interstitial) => createNativeInterstitial(this._player.nativeHandle, interstitial));
  }

  replaceAdTagParameters(adTagParameters?: Record<string, string>): void {
    NativeTHEOAdsModule.replaceAdTagParameters(this._player.nativeHandle, adTagParameters);
  }
}
