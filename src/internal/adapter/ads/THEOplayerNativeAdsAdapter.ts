import type { Ad, AdBreak, AdDescription, AdsAPI, GoogleDAI, THEOplayerView } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { THEOplayerNativeGoogleDAI } from './THEOplayerNativeGoogleDAI';
import { THEOplayerNativeOmid } from './THEOplayerNativeOmid';
import { Omid } from '../../../api/ads/Omid';

const NativeAdsModule = NativeModules.THEORCTAdsModule;

export class THEOplayerNativeAdsAdapter implements AdsAPI {
  private readonly _dai: GoogleDAI;
  private readonly _omid: Omid;

  constructor(private _player: THEOplayerView) {
    this._dai = new THEOplayerNativeGoogleDAI(this._player);
    this._omid = new THEOplayerNativeOmid(this._player);
  }

  playing(): Promise<boolean> {
    return NativeAdsModule.playing(this._player.nativeHandle);
  }

  skip(): void {
    NativeAdsModule.skip(this._player.nativeHandle);
  }

  currentAdBreak(): Promise<AdBreak> {
    return NativeAdsModule.currentAdBreak(this._player.nativeHandle);
  }

  currentAds(): Promise<Ad[]> {
    return NativeAdsModule.currentAds(this._player.nativeHandle);
  }

  scheduledAdBreaks(): Promise<AdBreak[]> {
    return NativeAdsModule.scheduledAdBreaks(this._player.nativeHandle);
  }

  schedule(ad: AdDescription): void {
    NativeAdsModule.schedule(this._player.nativeHandle, ad);
  }

  get dai(): GoogleDAI | undefined {
    return this._dai;
  }

  get omid(): Omid | undefined {
    return this._omid;
  }
}
