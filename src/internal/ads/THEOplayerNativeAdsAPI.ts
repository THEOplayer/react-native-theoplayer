import type { AdBreak, AdsAPI } from "react-native-theoplayer";
import { NativeModules } from "react-native";
import type { AdDescription } from "react-native-theoplayer";
import type { Ad } from "react-native-theoplayer";
import type { THEOplayerView } from "react-native-theoplayer";

export class THEOplayerNativeAdsAPI implements AdsAPI {

  constructor(private player: THEOplayerView) {
  }

  playing(): Promise<boolean> {
    return NativeModules.AdsModule.playing(this.player.nativeHandle);
  }

  skip(): void {
    NativeModules.AdsModule.skip(this.player.nativeHandle);
  }

  currentAdBreak(): Promise<AdBreak> {
    return NativeModules.AdsModule.currentAdBreak(this.player.nativeHandle);
  }

  currentAds(): Promise<Ad[]> {
    return NativeModules.AdsModule.currentAds(this.player.nativeHandle);
  }

  scheduledAdBreaks(): Promise<AdBreak[]> {
    return NativeModules.AdsModule.scheduledAdBreaks(this.player.nativeHandle);
  }

  schedule(ad: AdDescription): void {
    NativeModules.AdsModule.schedule(this.player.nativeHandle, ad);
  }
}
