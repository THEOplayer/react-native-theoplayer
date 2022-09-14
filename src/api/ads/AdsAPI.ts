/**
 * The API for advertisements.
 */
import type { AdDescription } from "../source/ads/Ads";
import type { AdBreak } from "./AdBreak";
import type { Ad } from "./Ad";
import type { GoogleDAI } from "./GoogleDai";

export interface AdsAPI {
  /**
   * Whether a linear ad is currently playing.
   */
  playing(): Promise<boolean>;

  /**
   * Skip the current linear ad.
   *
   * @remarks
   * <br/> - This will have no effect when the current linear ad is (not yet) skippable.
   */
  skip(): void;

  /**
   * The currently playing ad break.
   */
  currentAdBreak(): Promise<AdBreak>;

  /**
   * List of currently playing ads.
   */
  currentAds(): Promise<Ad[]>;

  /**
   * List of ad breaks which still need to be played.
   */
  scheduledAdBreaks(): Promise<AdBreak[]>;

  /**
   * Add an ad break request.
   *
   * @remarks
   * <br/> - Prefer scheduling ad breaks up front through SourceConfiguration.ads.
   */
  schedule(ad: AdDescription): void;

  /**
   * The Google DAI API.
   *
   * @remarks
   * <br/> - Only available when the feature or extension `'google-dai'` is enabled.
   */
  readonly dai?: GoogleDAI;
}
