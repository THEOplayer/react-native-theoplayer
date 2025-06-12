/**
 * The configuration for transmitting information to Content Delivery Networks (CDNs)
 * through Common Media Client Data (CMCD) (CTA-5004)
 */
export interface CmcdConfiguration {
  /**
   * The content ID parameter which should be passed as a CMCD value. If left empty, no content ID will be sent.
   *
   * @platform web
   */
  contentID?: string;

  /**
   * The session ID parameter which should be passed as a CMCD value. If left empty, a UUIDv4 will be generated when applying the configuration.
   *
   * @platform web
   */
  sessionID?: string;

  /**
   * A flag to indicate if request IDs should be sent or not.
   * When set to a truthy value, a UUIDv4 will be sent as a request id (`rid`) with every request to allow for request tracing.
   *
   * @platform web
   */
  sendRequestID?: boolean;

  /**
   * The target URI where client data is to be delivered in case the {@link transmissionMode} is set
   * to {@link CmcdTransmissionMode.JSON_OBJECT}.
   *
   * @platform web
   */
  jsonObjectTargetURI?: string;

  /**
   * An object containing custom keys which should be added to the generated CMCD parameters.
   * Note custom keys MUST carry a hyphenated prefix to ensure that there will not be a namespace collision with future
   * revisions to the specification. Clients SHOULD use a reverse-DNS syntax when defining their own prefix.
   *
   * @platform web
   */
  customKeys?: {
    [key: string]: string | number | boolean;
  };

  /**
   * The data transmission mode as defined in section 2 of the specification.
   */
  transmissionMode: CmcdTransmissionMode
}

export enum CmcdTransmissionMode {
  /**
   * Transmit CMCD data as a custom HTTP request header.
   *
   * @remarks
   * Usage of a custom header from a web browser user-agent will trigger a preflight OPTIONS request before each unique
   * media object request. This will lead to an increased request rate against the server. As a result, for CMCD
   * transmissions from web browser user-agents that require CORS-preflighting per URL,
   * the preferred mode of use is query arguments.
   */
  HTTP_HEADER,
  /**
   * Transmit CMCD data as a HTTP query argument.
   */
  QUERY_ARGUMENT,
  /**
   * Transmit CMCD data as a JSON object independent of the HTTP object request.
   */
  JSON_OBJECT,
  /**
   * Use the default transmission mode for each SDK:
   * - Web: Query arguments
   * - Android: Query arguments
   * - iOS: HTTP request headers
   */
  SDK_DEFAULT
}
