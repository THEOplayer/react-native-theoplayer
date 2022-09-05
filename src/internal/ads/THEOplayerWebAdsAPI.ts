import type { Ad, AdDescription, AdBreak, AdsAPI } from "react-native-theoplayer";
import type { THEOplayerView } from "../THEOplayerView.web";

export class THEOplayerWebAdsAPI implements AdsAPI {

  constructor(private player: THEOplayerView) {
  }

  currentAdBreak(): Promise<AdBreak> {
    const adBreak = this.player.nativePlayer?.ads?.currentAdBreak;
    return adBreak ? Promise.resolve(adBreak) : Promise.reject<AdBreak>();
  }

  currentAds(): Promise<Ad[]> {
    const ads = this.player.nativePlayer?.ads?.currentAds;
    return ads ? Promise.resolve(ads) : Promise.reject<Ad[]>();
  }

  playing(): Promise<boolean> {
    return Promise.resolve<boolean>(this.player.nativePlayer?.ads?.playing || false);
  }

  schedule(ad: AdDescription): void {
    this.player.nativePlayer?.ads?.schedule(ad);
  }

  scheduledAdBreaks(): Promise<AdBreak[]> {
    const adBreaks = this.player.nativePlayer?.ads?.scheduledAdBreaks;
    return adBreaks ? Promise.resolve(adBreaks) : Promise.reject<AdBreak[]>();
  }

  skip(): void {
    this.player.nativePlayer?.ads?.skip();
  }
}
