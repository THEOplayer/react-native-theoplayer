/**
 * Describes the key system configuration.
 *
 * @public
 */
export interface KeySystemConfiguration {
  /**
   * Property to indicate whether the ability to persist state is required. This includes session data and any other type of state. The player will forward this information to the CDM when requesting access to the media key system.
   *
   * Available values are:
   * - "required": This will instruct the player to make the key sessions persistent.
   * - "optional": Choice of making use of a persistent key session is up to the player.
   * - "not-allowed": A temporary key session will be used.
   */
  persistentState?: 'required' | 'optional' | 'not-allowed';

  /**
   * Used to indicate if media key sessions can be shared across different instances, for example different browser profiles, player instances or applications. The player will forward this information to the CDM when requesting access to the media key system.
   * Available values are:
   * - “required”
   * - “optional”
   * - “not-allowed”
   */
  distinctiveIdentifier?: 'required' | 'optional' | 'not-allowed';

  /**
   * Allows to configure the robustness level required for audio data. The robustness level can be used to define the DRM security level. If the security level requested is not available on the platform, playback will fail.
   *
   * Following values are supported for Widevine:
   * - "": Lowest security level
   * - "SW_SECURE_CRYPTO": Secure decryption in software is required. This matches Widevine L3.
   * - "SW_SECURE_DECODE": Media data is to be decoded securely in software. This matches Widevine L3.
   * - "HW_SECURE_CRYPTO": Secure decryption in hardware is required. This matches Widevine L2.
   * - "HW_SECURE_DECODE": Media data is to be decoded securely in hardware. This matches Widevine L1.
   * - "HW_SECURE_ALL": The media pipeline must be decrypted and decoded securely in hardware. This matches Widevine L1.
   */
  audioRobustness?: string;

  /**
   * Allows to configure the robustness level required for video data. The robustness level can be used to define the DRM security level. If the security level requested is not available on the platform, playback will fail.
   *
   * Following values are supported for Widevine:
   *
   * - "": Lowest security level
   * - "SW_SECURE_CRYPTO": Secure decryption in software is required. This matches Widevine L3.
   * - "SW_SECURE_DECODE": Media data is to be decoded securely in software. This matches Widevine L3.
   * - "HW_SECURE_CRYPTO": Secure decryption in hardware is required. This matches Widevine L2.
   * - "HW_SECURE_DECODE": Media data is to be decoded securely in hardware. This matches Widevine L1.
   * - "HW_SECURE_ALL": The media pipeline must be decrypted and decoded securely in hardware. This matches Widevine L1.
   */
  videoRobustness?: string;

  /**
   * The licence acquisition URL.
   *
   * @remarks
   * <br/> - If provided, the player will send license requests for the intended DRM scheme to the provided value.
   * <br/> - If not provided, the player will use the default license acquisition URLs.
   */
  licenseAcquisitionURL?: string;

  /**
   * The licence type.
   *
   * @internal
   */
  licenseType?: LicenseType;

  /**
   * Record of HTTP headers for the licence acquisition request.
   * Each entry contains a header name with associated value.
   */
  headers?: { [headerName: string]: string };

  /**
   * Whether the player is allowed to use credentials for cross-origin requests.
   *
   * @remarks
   * <br/> - Credentials are cookies, authorization headers or TLS client certificates.
   *
   * @defaultValue `false`
   */
  useCredentials?: boolean;

  /**
   * Record of query parameters for the licence acquisition request.
   * Each entry contains a query parameter name with associated value.
   */
  queryParameters?: { [key: string]: any };

  /**
   * The certificate for the key system. This can be either an ArrayBuffer or Uint8Array containing the raw certificate bytes or a base64-encoded variant of this.
   */
  certificate?: string;

  /**
   * Process the certificate's request.
   *
   * @deprecated Please use {@link registerContentProtectionIntegration} and {@link ContentProtectionIntegration.onCertificateRequest} instead.
   */
  certificateRequestProcessor?: DRMProcessor;

  /**
   * Process the certificate's response.
   *
   * @deprecated Please use {@link registerContentProtectionIntegration} and {@link ContentProtectionIntegration.onCertificateResponse} instead.
   */
  certificateResponseProcessor?: DRMProcessor;

  /**
   * Process the license's request.
   *
   * @deprecated Please use {@link registerContentProtectionIntegration} and {@link ContentProtectionIntegration.onLicenseRequest} instead.
   */
  licenseRequestProcessor?: DRMProcessor;

  /**
   * Process the license's response.
   *
   * @deprecated Please use {@link registerContentProtectionIntegration} and {@link ContentProtectionIntegration.onLicenseResponse} instead.
   */
  licenseResponseProcessor?: DRMProcessor;
}

/**
 * The type of the licence, represented by a value from the following list:
 * <br/> - `'temporary'`
 * <br/> - `'persistent'`
 *
 * @public
 */
export type LicenseType = 'temporary' | 'persistent';

/**
 * Describes the FairPlay key system configuration.
 *
 * @public
 */
export interface FairPlayKeySystemConfiguration extends KeySystemConfiguration {
  /**
   * The URL of the certificate.
   */
  certificateURL?: string;
}

/**
 * Describes the PlayReady key system configuration.
 *
 * @public
 */
export interface PlayReadyKeySystemConfiguration extends KeySystemConfiguration {
  /**
   * Custom data which will be passed to the CDM.
   */
  customData?: string;
}

/**
 * Describes the Widevine key system configuration.
 *
 * @public
 */
export type WidevineKeySystemConfiguration = KeySystemConfiguration;

/**
 * A function which processes DRM data.
 *
 * @public
 */
export type DRMProcessor = (arrayBuffer: ArrayBuffer) => ArrayBuffer;

/**
 * Describes the ClearKey key system configuration.
 *
 * @public
 */
export interface ClearkeyKeySystemConfiguration extends KeySystemConfiguration {
  /**
   * List of decryption keys.
   */
  keys?: ClearkeyDecryptionKey[];
}

/**
 * Describes the ClearKey decryption key.
 *
 * @public
 */
export interface ClearkeyDecryptionKey {
  /**
   * The identifier of the key.
   *
   * @remarks
   * <br/> - This is a base64url encoding of the octet sequence containing the key ID.
   * <br/> - See {@link https://www.w3.org/TR/encrypted-media/#clear-key-license-format | Clear Key License Format}.
   */
  id: string;

  /**
   * The value of the key.
   *
   * @remarks
   * <br/> - The base64url encoding of the octet sequence containing the symmetric key value.
   * <br/> - See {@link https://www.w3.org/TR/encrypted-media/#clear-key-license-format | Clear Key License Format}.
   */
  value: string;
}

/**
 * Describes the AES128 key system configuration.
 *
 * @public
 */
export interface AES128KeySystemConfiguration {
  /**
   * Whether the player is allowed to use credentials for cross-origin requests.
   *
   * @remarks
   * <br/> - Credentials are cookies, authorization headers or TLS client certificates.
   *
   * @defaultValue `false`
   */
  useCredentials?: true;
}

/**
 * Describes the configuration of the DRM.
 *
 * @public
 */
export interface DRMConfiguration {
  /**
   * The identifier of the DRM integration.
   */
  integration?: string;

  /**
   * The configuration of the FairPlay key system.
   */
  fairplay?: FairPlayKeySystemConfiguration;

  /**
   * The configuration of the PlayReady key system.
   */
  playready?: PlayReadyKeySystemConfiguration;

  /**
   * The configuration of the Widevine key system.
   */
  widevine?: WidevineKeySystemConfiguration;

  /**
   * The configuration of the ClearKey key system.
   */
  clearkey?: ClearkeyKeySystemConfiguration;

  /**
   * The configuration of the AES key system.
   */
  aes128?: AES128KeySystemConfiguration;

  /**
   * An object of key/value pairs which can be used to pass in specific parameters related to a source into a
   * {@link ContentProtectionIntegration}.
   */
  integrationParameters?: { [parameterName: string]: any };

  /**
   * An ordered list of URNs of key systems as specified by https://dashif.org/identifiers/content_protection/, or one of the following identifiers:
   *
   * `"widevine"` alias for `"urn:uuid:edef8ba9-79d6-4ace-a3c8-27dcd51d21ed"`
   * `"fairplay"` alias for `"urn:uuid:94ce86fb-07bb-4b43-adb8-93d2fa968ca2"`
   * `"playready"` alias for `"urn:uuid:9a04f079-9840-4286-ab92-e65be0885f95"`
   *
   * The first key system in this list which is supported on the given platform will be used for playback.
   *
   * Default value is ['widevine', 'playready', 'fairplay'].
   */
  preferredKeySystems?: Array<KeySystemId | string>;
}

/**
 * The id of a key system. Possible values are 'widevine', 'fairplay' and 'playready'.
 *
 * @public
 */
export type KeySystemId = 'widevine' | 'fairplay' | 'playready';
