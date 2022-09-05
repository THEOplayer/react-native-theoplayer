import type { AdBreak, AdsAPI } from "react-native-theoplayer";
import { NativeModules } from "react-native";
import type { AdDescription } from "../../api/source/ads/Ads";
import type { Ad } from "react-native-theoplayer";
import type { THEOplayerView } from "react-native-theoplayer";

const TAG = 'THEOplayerAdsAPI';

export class THEOplayerNativeAdsAPI implements AdsAPI {

  constructor(private player: THEOplayerView) {
  }

  playing(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        NativeModules.AdsModule.playing(this.player.nativeHandle, (isPlaying: boolean) => {
          resolve(isPlaying);
        });
      } catch (e) {
        console.error(TAG, e);
        reject(e);
      }
    });
  }

  skip(): void {
    try {
      NativeModules.AdsModule.skip(this.player.nativeHandle);
    } catch (e) {
      console.error(TAG, e);
    }
  }

  currentAdBreak(): Promise<AdBreak> {
    return new Promise((resolve, reject) => {
      try {
        NativeModules.AdsModule.currentAdBreak(this.player.nativeHandle, (adbreak: AdBreak) => {
          resolve(adbreak);
        });
      } catch (e) {
        console.error(TAG, e);
        reject(e);
      }
    });
  }

  currentAds(): Promise<Ad[]> {
    return new Promise((resolve, reject) => {
      try {
        NativeModules.AdsModule.currentAds(this.player.nativeHandle, (ads: Ad[]) => {
          resolve(ads);
        });
      } catch (e) {
        console.error(TAG, e);
        reject(e);
      }
    });
  }

  scheduledAdBreaks(): Promise<AdBreak[]> {
    return new Promise((resolve, reject) => {
      try {
        NativeModules.AdsModule.scheduledAdBreaks(this.player.nativeHandle, (adBreaks: AdBreak[]) => {
          resolve(adBreaks);
        });
      } catch (e) {
        console.error(TAG, e);
        reject(e);
      }
    });
  }

  schedule(ad: AdDescription): void {
    try {
      NativeModules.AdsModule.schedule(this.player.nativeHandle, ad);
    } catch (e) {
      console.error(TAG, e);
    }
  }
}
