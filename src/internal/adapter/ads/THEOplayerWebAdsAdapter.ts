import type { Ad, AdBreak, AdDescription, AdsAPI, GoogleDAI } from 'react-native-theoplayer';
import { THEOplayerWebGoogleDAI } from './THEOplayerWebGoogleDAI';
import type { ChromelessPlayer } from 'theoplayer';
import { Omid } from '../../../api/ads/Omid';

export class THEOplayerWebAdsAdapter implements AdsAPI {
  private readonly _player: ChromelessPlayer;
  private _dai: GoogleDAI | undefined;

  constructor(player: ChromelessPlayer) {
    this._player = player;
  }

  currentAdBreak(): Promise<AdBreak> {
    const adBreak = this._player.ads?.currentAdBreak;
    return adBreak ? Promise.resolve(adBreak) : Promise.reject<AdBreak>();
  }

  currentAds(): Promise<Ad[]> {
    const ads = this._player.ads?.currentAds;
    return ads ? Promise.resolve(ads) : Promise.reject<Ad[]>();
  }

  playing(): Promise<boolean> {
    return Promise.resolve<boolean>(this._player.ads?.playing || false);
  }

  schedule(ad: AdDescription): void {
    this._player.ads?.schedule(ad);
  }

  scheduledAdBreaks(): Promise<AdBreak[]> {
    const adBreaks = this._player.ads?.scheduledAdBreaks;
    return adBreaks ? Promise.resolve(adBreaks) : Promise.reject<AdBreak[]>();
  }

  skip(): void {
    this._player.ads?.skip();
  }

  get dai(): GoogleDAI | undefined {
    if (!this._dai) {
      const nativeDai = this._player.ads?.dai;
      if (!nativeDai) {
        // Not native DAI available
        return undefined;
      }
      this._dai = new THEOplayerWebGoogleDAI(nativeDai);
    }
    return this._dai;
  }

  get omid(): Omid | undefined {
    // NYI
    console.warn('The Omid API is not yet implemented for Web platforms.');
    return undefined;
  }
}
