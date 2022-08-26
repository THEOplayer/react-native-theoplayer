import type { AdBreak, AdsAPI } from "react-native-theoplayer";
import { NativeModules } from "react-native";
import type { THEOplayerView } from "../THEOplayerView";
import type { AdDescription } from "../../api/source/ads/Ads";
import type { Ad } from "react-native-theoplayer";

const TAG = 'THEOplayerAdsAPI';

export class THEOplayerAdsAPI implements AdsAPI {

  constructor(private player: THEOplayerView) {
  }

  playing(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        NativeModules.AdsModule.playing(this.player.nodeHandle, (isPlaying: boolean) => {
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
      NativeModules.AdsModule.skip(this.player.nodeHandle);
    } catch (e) {
      console.error(TAG, e);
    }
  }

  currentAdBreak(): Promise<AdBreak> {
    return new Promise((resolve, reject) => {
      try {
        NativeModules.AdsModule.currentAdBreak(this.player.nodeHandle, (adbreak: AdBreak) => {
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
        NativeModules.AdsModule.currentAds(this.player.nodeHandle, (ads: Ad[]) => {
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
        NativeModules.AdsModule.scheduledAdBreaks(this.player.nodeHandle, (adBreaks: AdBreak[]) => {
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
      NativeModules.AdsModule.schedule(this.player.nodeHandle, ad);
    } catch (e) {
      console.error(TAG, e);
    }
  }
}
