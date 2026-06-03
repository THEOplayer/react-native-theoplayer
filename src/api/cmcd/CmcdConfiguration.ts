/**
 * Configuration for a CMCD endpoint.
 *
 * @remarks
 * <br/> - Available since v11.4.0.
 *
 * @category CMCD
 * @public
 */
export interface CmcdEndpointConfiguration {
  /**
   * The URL of the CMCD endpoint.
   */
  url: string;
}

/**
 * Describes the CMCD (Common Media Client Data) configuration for event mode reporting at the player level.
 *
 * @remarks
 * <br/> - Available since v11.4.0.
 * <br/> - This configuration is set at the player level. For source-level configuration, see {@link CmcdSourceConfiguration}.
 *
 * @category CMCD
 * @category Player
 * @public
 */
export interface CmcdPlayerConfiguration {
  /**
   * An external session ID that can be used to identify the current playback session.
   */
  externalSessionId?: string;

  /**
   * A user ID that can be used to identify the user.
   */
  userId?: string;

  /**
   * A list of CMCD endpoints to which events should be sent.
   */
  eventEndpoints?: CmcdEndpointConfiguration[];
}

/**
 * Describes the CMCD (Common Media Client Data) configuration at the source level.
 *
 * @remarks
 * <ul>
 *   <li>Event mode reporting available since v11.4.0.</li>
 *   <li>
 *     This extends the player-level {@link CmcdPlayerConfiguration} by additionally allowing a session ID to be specified
 *  per source. Source-level values take precedence over player-level values for overlapping fields,
 *  except for `eventEndpoints` which are merged (both player and source endpoints receive events).
 *  </li>
 * </ul>
 *
 * @category CMCD
 * @category Source
 * @public
 */
export interface CmcdSourceConfiguration extends CmcdPlayerConfiguration {
  /**
   * The content ID parameter which should be passed as a CMCD value. If left empty, no content ID will be sent.
   *
   * @platform web
   *
   * @remarks Request mode only
   */
  contentID?: string;
  /**
   * A GUID identifying the current playback session. If left empty, a UUIDv4 will be generated when applying the configuration.
   *
   * @remarks
   * <ul>
   *   <li>A playback session typically consists of the playback of a single media
   * asset along with accompanying content such as advertisements. The maximum length is 64 characters.
   * It is RECOMMENDED to conform to the UUID specification (https://tools.ietf.org/html/rfc4122).
   * </li>
   * <li>Event mode only for iOS and Android</li>
   * </ul>
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

/**
 * The configuration for transmitting information to Content Delivery Networks (CDNs)
 * through Common Media Client Data (CMCD) (CTA-5004)
 *
 * @category CMCD
 * @category Source
 * @public
 *
 * @deprecated Use {@link CmcdSourceConfiguration} instead.
 */
export type CmcdConfiguration = CmcdSourceConfiguration;

/**
 * The CMCD transmission mode.
 *
 * @category Source
 * @public
 */
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
