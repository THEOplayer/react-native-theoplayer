/**
 * A request, either for a certificate or a license.
 * @public
 */
export interface ContentProtectionRequest {
    /**
     * The URL for the certificate server. By default, this will equal the certificate URL configured in the
     * `{@link KeySystemConfiguration}`.
     */
    url: string;

    /**
     * The method of the HTTP request, for example: GET, POST or PUT.
     *
     * @remarks
     * <br/> - Will be equal to GET for Fairplay certificate requests and POST for Widevine certificate requests.
     * <br/> - Will be equal to POST for all license requests.
     */
    method: string;

    /**
     * The HTTP request headers to be sent to the server.
     */
    headers: { [headerName: string]: string };

    /**
     * The body of the certificate request.
     *
     * @remarks
     * <br/> - For GET requests (such as with Fairplay), the body will be empty (null).
     * <br/> - For POST requests (such as with Widevine): the body will contain the two bytes in an array as specified in the certificate request protocol.
     */
    body: Uint8Array | null;

    /**
     * Whether the player is allowed to use credentials for cross-origin requests.
     */
    useCredentials: boolean;
}

/**
 * A request for a certificate.
 *
 * @public
 */
export type CertificateRequest = ContentProtectionRequest;

/**
 * A request for a license.
 * @public
 */
export interface LicenseRequest extends ContentProtectionRequest {
    /**
     * The SKD URL (for example skd://fb64ba7c5bd34bf188cf9ba76ab8370e) as extracted from the #EXT-X-KEY tag in the HLS playlist.
     *
     * @remarks
     * <br/> - Only available for Fairplay license requests. The value will be `undefined` otherwise.
     */
    fairplaySkdUrl: string | undefined;
}
