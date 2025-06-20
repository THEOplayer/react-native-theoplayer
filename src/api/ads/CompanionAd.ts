/**
 * Represents a companion ad which is displayed near the video player.
 *
 * @category Ads
 * @public
 */
export interface CompanionAd {
  /**
   * The identifier of the element in which the companion ad should be appended, if available.
   *
   * @remarks
   * <br/> Only available for Google DAI and THEO ads if provided in the VAST.
   */
  adSlotId?: string;

  /**
   * The alternative description for the ad.
   *
   * @remarks
   * <br/> - Returns value as reported in the VAST StaticResource. If not specified, it returns an empty string.
   * <br/> - Returns an empty string for THEO ads if not available.
   * <br/> - Returns an empty string for Google IMA / Google DAI integrations.
   */
  altText: string;

  /**
   * The content of the ad, as HTML.
   *
   * @remarks
   * <br/> - Available for StaticResource and HTMLResource in THEO ad system.
   * <br/> - Available in the DAI ad system.
   */
  contentHTML: string;

  /**
   * The website of the advertisement.
   *
   * @remarks
   * <br/> - Only available for StaticResource if specified by the VAST. Otherwise returns an empty string.
   */
  clickThrough?: string;

  /**
   * The height of the ad, in pixels.
   *
   * @remarks
   * <br/> - Only available for IMA ad system and THEO ad system.
   */
  height: number;

  /**
   * The URI of the ad content as specified in the VAST file.
   *
   * @remarks
   * <br/> - Only available in the THEO ad system for StaticResource. Otherwise returns an empty string.
   */
  resourceURI: string;

  /**
   * The width of the ad, in pixels.
   *
   * @remarks
   * <br/> - Only available for IMA ad system and THEO ad system.
   */
  width: number;
}
