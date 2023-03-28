import type { AdDescription, AdIntegrationKind, AdSource } from "./Ads";

/**
 * Describes a Google IMA ad break request.
 *
 * @public
 */
export interface IMAAdDescription extends AdDescription {
  /**
   * The integration of this ad break.
   */
  integration: AdIntegrationKind.google_ima;

  /**
   * The source of the ad
   *
   * @remarks
   * <br/> - VAST, VMAP and VPAID are supported.
   */
  sources: string | AdSource;

  /**
   * Optional settings object for mapping verification vendors (google.ima.OmidVerificationVendor) to OMID Access Modes (google.ima.OmidAccessMode).
   */
  omidAccessModeRules?: { [key: number]: string };
}
