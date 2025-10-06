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

abstract class NativeInterstitial implements Interstitial {
  private _adTagParameters: Record<string, string>;

  readonly id: string;
  readonly type: InterstitialType;
  readonly startTime: number;
  readonly duration: number | undefined;

  constructor(interstitial: Interstitial) {
    this.id = interstitial.id;
    this.type = interstitial.type;
    this.startTime = interstitial.startTime;
    this.duration = interstitial.duration;
    this._adTagParameters = interstitial.adTagParameters;
  }

  get adTagParameters(): Record<string, string> {
    return this._adTagParameters;
  }

  set adTagParameters(newAdTagParamters: Record<string, string>) {
    this._adTagParameters = newAdTagParamters;
  }
}

export class NativeAdBreakInterstitial extends NativeInterstitial implements AdBreakInterstitial {
  type: 'adbreak' = 'adbreak';
  readonly layout: TheoAdsLayout;
  readonly backdropUri: string | undefined;
  readonly ads: readonly Ad[];

  constructor(interstitial: AdBreakInterstitial) {
    super(interstitial);
    this.layout = interstitial.layout;
    this.backdropUri = interstitial.backdropUri;
    this.ads = interstitial.ads;
  }
}

export class NativeOverlayInterstitial extends NativeInterstitial implements OverlayInterstitial {
  type: 'overlay' = 'overlay';
  readonly imageUrl: string | undefined;
  readonly clickThrough: string | undefined;
  readonly position: OverlayPosition;
  readonly size: OverlaySize;

  constructor(interstitial: OverlayInterstitial) {
    super(interstitial);
    this.imageUrl = interstitial.imageUrl;
    this.clickThrough = interstitial.clickThrough;
    this.position = interstitial.position;
    this.size = interstitial.size;
  }
}

export function createNativeInterstitial(interstitial: Interstitial): Interstitial {
  switch (interstitial.type) {
    case 'adbreak':
      return new NativeAdBreakInterstitial(interstitial as AdBreakInterstitial);
    case 'overlay':
      return new NativeOverlayInterstitial(interstitial as OverlayInterstitial);
  }
}
