import type { CertificateRequest, LicenseRequest } from './ContentProtectionRequest';
import type { CertificateResponse, LicenseResponse } from './ContentProtectionResponse';

/**
 * A synchronous or asynchronous return type
 *
 * @public
 */
export type MaybeAsync<T> = T | PromiseLike<T>;

export type BufferSource = ArrayBufferView | ArrayBuffer;

/**
 * This ContentProtectionIntegration defines some methods to alter license and certificate requests and responses.
 *
 * @public
 */
export interface ContentProtectionIntegration {
  /**
   * Handler which will be called when a HTTP request for a new certificate is about to be sent.
   *
   * @remarks
   * If a valid certificate was provided as part of the {@link KeySystemConfiguration.certificate}, this handler will not be called.
   * The handler must return either a request or a raw certificate. When a (possibly modified) request is returned,
   * the player will send that request instead of the original request. When a raw certificate is returned,
   * the request is skipped entirely and the certificate is used directly. If no handler is provided, the player sends the original request.
   *
   * For example, an integration may want to “wrap” the request body in a different format (e.g. JSON or XML) for
   * certain DRM vendors, or add additional authentication tokens to the request.
   * Alternatively, an integration may want to send the HTTP request using its own network stack,
   * and return the final certificate response to the player.
   *
   * @param request - The {@link CertificateRequest} that is about to be sent.
   */
  onCertificateRequest?(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource>;

  /**
   * Handler which will be called when a HTTP request for a certificate returns a response.
   *
   * @remarks
   * The handler will be called regardless of the HTTP status code on the response (i.e. also for unsuccessful statuses outside of the 200-299 range).
   * The handler must return the raw certificate, in a manner suitable for further processing by the CDM.
   * If no handler is provided, the player uses the response body as raw certificate, but only if the response’s status indicates success.
   *
   * For example, an integration may want to “unwrap” a wrapped JSON or XML response body, turning it into a raw certificate.
   *
   * @param response - The {@link CertificateResponse} that was returned from the certificate request.
   */
  onCertificateResponse?(response: CertificateResponse): MaybeAsync<BufferSource>;

  /**
   * Handler which will be called when a HTTP request for a new license is about to be sent.
   *
   * @remarks
   * The handler must return either a request or a raw license. When a (possibly modified) request is returned,
   * the player will send that request instead of the original request. When a raw license is returned,
   * the request is skipped entirely and the license is used directly. If no handler is provided, the player sends the original request.
   *
   * For example, an integration may want to “wrap” the request body in a different format (e.g. JSON or XML) for certain DRM vendors,
   * or add additional authentication tokens to the request. Alternatively, an integration may want to send the HTTP request using its own network stack,
   * and return the final license response to the player.
   *
   * @param request - The {@link LicenseRequest} that is about to be sent.
   */
  onLicenseRequest?(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource>;

  /**
   * Handler which will be called when a HTTP request for a license returns an response.
   *
   * @remarks
   * The handler will be called regardless of the HTTP status code on the response (i.e. also for unsuccessful statuses outside of the 200-299 range).
   * The handler must return the raw license, in a manner suitable for further processing by the CDM.
   * If no handler is provided, the player uses the response body as raw license, but only if the response’s status indicates success.
   *
   * For example, an integration may want to “unwrap” a wrapped JSON or XML response body, turning it into a raw license.
   *
   * @param response - The {@link LicenseResponse} that was returned from the license request.
   */
  onLicenseResponse?(response: LicenseResponse): MaybeAsync<BufferSource>;

  /**
   * A function to extract the Fairplay content ID from the key URI, as given by the URI attribute of the `#EXT-X-KEY` tag in the HLS playlist (m3u8).
   *
   * @remarks
   * In order to start a Fairplay license request, the player must provide the initialization data, the content ID and the certificate to the CDM.
   * The content ID is usually contained in the key URI in some vendor-specific way, for example in the host name (e.g. `skd://123456789`)
   * or in the URL query (e.g. `skd://vendor?123456789`). This function should extract this content ID from the key URI.
   * This method is required only for Fairplay integrations. It is ignored for other key systems.
   *
   * @param skdUrl - The key URI.
   */
  extractFairplayContentId?(skdUrl: string): MaybeAsync<string>;
}
