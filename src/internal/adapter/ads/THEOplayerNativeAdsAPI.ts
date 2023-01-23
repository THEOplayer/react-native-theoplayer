import type { Ad, AdBreak, AdDescription, AdsAPI, GoogleDAI, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { THEOplayerNativeGoogleDAI } from './THEOplayerNativeGoogleDAI';

export class THEOplayerNativeAdsAPI implements AdsAPI {
  private readonly _dai: GoogleDAI;

  constructor(private _player: THEOplayerView) {
    this._dai = new THEOplayerNativeGoogleDAI(this._player);
  }

  playing(): Promise<boolean> {
    return NativeModules.AdsModule.playing(this._player.nativeHandle);
  }

  skip(): void {
    NativeModules.AdsModule.skip(this._player.nativeHandle);
  }

  currentAdBreak(): Promise<AdBreak> {
    return NativeModules.AdsModule.currentAdBreak(this._player.nativeHandle);
  }

  currentAds(): Promise<Ad[]> {
    return NativeModules.AdsModule.currentAds(this._player.nativeHandle);
  }

  scheduledAdBreaks(): Promise<AdBreak[]> {
    return NativeModules.AdsModule.scheduledAdBreaks(this._player.nativeHandle);
  }

  schedule(ad: AdDescription): void {
    NativeModules.AdsModule.schedule(this._player.nativeHandle, ad);
  }

  get dai(): GoogleDAI | undefined {
    return this._dai;
  }
}
