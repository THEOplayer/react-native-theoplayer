/**
 * The configuration for transmitting information to Content Delivery Networks (CDNs)
 * through Common Media Client Data (CMCD)
 */
export interface CmcdConfiguration {
  /**
   * The transmission mode that is to be used for transmitting the information to the CDNs
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
