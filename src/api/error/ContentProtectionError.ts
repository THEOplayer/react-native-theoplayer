/**
 * An error related to content protection.
 *
 * @category Errors
 * @category Content Protection
 * @public
 */
export interface ContentProtectionErrorObject {
  /**
   * The error code.
   */
  readonly errorCode: string;

  /**
   * The error message.
   */
  readonly errorMessage: string;

  /**
   * The URL that was used in the request.
   *
   * @remarks
   * Only available for certificate or license request errors.
   */
  readonly url?: string;

  /**
   * The status code from the HTTP response.
   *
   * @remarks
   * Only available for certificate or license request errors.
   */
  readonly status?: number;

  /**
   * The status text from the HTTP response.
   *
   * @remarks
   * Only available for certificate or license request errors.
   */
  readonly statusText?: string;

  /**
   * The body contained in the HTTP response.
   *
   * @remarks
   * Only available for certificate or license request errors.
   */
  readonly response?: string;

  /**
   * The internal error code from the CDM.
   *
   * @remarks
   * Only available for internal CDM errors.
   */
  readonly systemCode?: number;
}
