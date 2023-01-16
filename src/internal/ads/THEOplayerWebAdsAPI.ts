import type { Ad, AdDescription, AdBreak, AdsAPI, GoogleDAI } from "@wouterds/react-native-theoplayer";
import type { THEOplayerView } from "../THEOplayerView.web";
import { THEOplayerWebGoogleDAI } from "./THEOplayerWebGoogleDAI";

export class THEOplayerWebAdsAPI implements AdsAPI {

  private _dai: GoogleDAI | undefined;

  constructor(private readonly _player: THEOplayerView) {
  }

  currentAdBreak(): Promise<AdBreak> {
    const adBreak = this._player.nativePlayer?.ads?.currentAdBreak;
    return adBreak ? Promise.resolve(adBreak) : Promise.reject<AdBreak>();
  }

  currentAds(): Promise<Ad[]> {
    const ads = this._player.nativePlayer?.ads?.currentAds;
    return ads ? Promise.resolve(ads) : Promise.reject<Ad[]>();
  }

  playing(): Promise<boolean> {
    return Promise.resolve<boolean>(this._player.nativePlayer?.ads?.playing || false);
  }

  schedule(ad: AdDescription): void {
    this._player.nativePlayer?.ads?.schedule(ad);
  }

  scheduledAdBreaks(): Promise<AdBreak[]> {
    const adBreaks = this._player.nativePlayer?.ads?.scheduledAdBreaks;
    return adBreaks ? Promise.resolve(adBreaks) : Promise.reject<AdBreak[]>();
  }

  skip(): void {
    this._player.nativePlayer?.ads?.skip();
  }

  get dai(): GoogleDAI | undefined {
    if (!this._dai) {
      const nativeDai = this._player.nativePlayer?.ads?.dai;
      if (!nativeDai) {
        // Not native DAI available
        return undefined;
      }
      this._dai = new THEOplayerWebGoogleDAI(nativeDai);
    }
    return this._dai;
  }
}
