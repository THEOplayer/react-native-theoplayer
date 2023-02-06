type EffectiveType = '4g' | '3g' | '2g' | 'slow-2g' | 'default';
type NetworkInformationType = 'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi' | 'wimax';

interface NetworkInformation extends EventTarget {
  readonly downlink: number;
  readonly downlinkMax: number;
  readonly effectiveType: EffectiveType;
  readonly rtt: number;
  readonly type: NetworkInformationType;
}

interface Navigator {
  readonly connection: NetworkInformation;
  readonly oscpu: string;
  readonly msMaxTouchPoints: number;
}

interface HTMLMediaElement {
  getStartDate?(): Date;
}

interface HTMLVideoElement extends HTMLMediaElement {
  playsInline: boolean;
  webkitDroppedFrameCount?: number;
  webkitDecodedFrameCount?: number;
}

/*
 * iOS HTMLVideoElement fullscreen
 * https://developer.apple.com/reference/webkitjs/htmlvideoelement
 */
interface HTMLVideoElement {
  readonly webkitDisplayingFullscreen?: boolean;
  webkitPresentationMode?: string;

  webkitSupportsPresentationMode?(mode: string): boolean;

  webkitSetPresentationMode?(type: string): void;

  webkitEnterFullscreen?(): void;

  webkitExitFullscreen?(): void;
}
