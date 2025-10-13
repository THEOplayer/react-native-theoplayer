import { NativeModules } from 'react-native';
import type {
  Ad,
  AdBreakInterstitial,
  Interstitial,
  InterstitialType,
  OverlayInterstitial,
  OverlayPosition,
  OverlaySize,
  TheoAdsLayout,
} from 'react-native-theoplayer';

const NativeTHEOAdsModule = NativeModules.THEORCTTHEOAdsModule;

abstract class NativeInterstitial implements Interstitial {
  private node: number;
  private _adTagParameters: Record<string, string>;

  readonly id: string;
  readonly type: InterstitialType;
  readonly startTime: number;
  readonly duration: number | undefined;

  constructor(node: number, interstitial: Interstitial) {
    this.node = node;
    this.id = interstitial.id;
    this.type = interstitial.type;
    this.startTime = interstitial.startTime;
    this.duration = interstitial.duration;
    this._adTagParameters = this.createAdTagParametersProxy(interstitial.adTagParameters);
  }

  get adTagParameters(): Record<string, string> {
    return this._adTagParameters;
  }

  set adTagParameters(newAdTagParamters: Record<string, string>) {
    this._adTagParameters = this.createAdTagParametersProxy(newAdTagParamters);
    NativeTHEOAdsModule.setAdTagParameters(this.node, this.id, newAdTagParamters);
  }

  private createAdTagParametersProxy(target: Record<string, string>): Record<string, string> {
    return new Proxy(target, {
      set: (adTagParameters, key, newValue) => {
        const currentValue = adTagParameters[key as string];
        adTagParameters[key as string] = newValue;
        if (currentValue !== newValue) {
          NativeTHEOAdsModule.setAdTagParameters(this.node, this.id, adTagParameters);
        }
        return true;
      },
    });
  }
}

export class NativeAdBreakInterstitial extends NativeInterstitial implements AdBreakInterstitial {
  type = 'adbreak' as const;
  readonly layout: TheoAdsLayout;
  readonly backdropUri: string | undefined;
  readonly ads: readonly Ad[];

  constructor(node: number, interstitial: AdBreakInterstitial) {
    super(node, interstitial);
    this.layout = interstitial.layout;
    this.backdropUri = interstitial.backdropUri;
    this.ads = interstitial.ads;
  }
}

export class NativeOverlayInterstitial extends NativeInterstitial implements OverlayInterstitial {
  type = 'overlay' as const;
  readonly imageUrl: string | undefined;
  readonly clickThrough: string | undefined;
  readonly position: OverlayPosition;
  readonly size: OverlaySize;

  constructor(node: number, interstitial: OverlayInterstitial) {
    super(node, interstitial);
    this.imageUrl = interstitial.imageUrl;
    this.clickThrough = interstitial.clickThrough;
    this.position = interstitial.position;
    this.size = interstitial.size;
  }
}

export function createNativeInterstitial(node: number, interstitial: Interstitial): Interstitial {
  switch (interstitial.type) {
    case 'adbreak':
      return new NativeAdBreakInterstitial(node, interstitial as AdBreakInterstitial);
    case 'overlay':
      return new NativeOverlayInterstitial(node, interstitial as OverlayInterstitial);
  }
}
