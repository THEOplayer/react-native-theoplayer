import type { CertificateRequest, ContentProtectionRequest, LicenseRequest } from './ContentProtectionRequest';

/**
 * The response, either of a license or for a certificate request.
 *
 * @category Content Protection
 * @public
 */
export interface ContentProtectionResponse {
  /**
   * The request for which the response is being returned.
   */
  request: ContentProtectionRequest;

  /**
   * The URL from which the response was returned. This might have been redirected transparently.
   */
  url: string;

  /**
   * The status code as returned in the HTTP response.
   */
  status: number;

  /**
   * The status text as returned in the HTTP response.
   */
  statusText: string;

  /**
   * The HTTP headers as returned by the server.
   *
   * @remarks
   * <br/> - On web not all headers might be shown due to Cross Origin Resource Sharing restrictions.
   */
  headers: { [headerName: string]: string };

  /**
   * The body of the response.
   */
  body: Uint8Array;
}

/**
 * The response of a certificate request.
 *
 * @category Content Protection
 * @public
 */
export interface CertificateResponse extends ContentProtectionResponse {
  /**
   * The request for which the response is being returned.
   */
  request: CertificateRequest;
}

/**
 * The response of a license request.
 *
 * @category Content Protection
 * @public
 */
export interface LicenseResponse extends ContentProtectionResponse {
  /**
   * The request for which the response is being returned.
   */
  request: LicenseRequest;
}
