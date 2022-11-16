export interface TitaniumIntegrationParameters {
  /**
   * The account name.
   *
   * @remarks
   * <br/> - Required when doing device-based authentication.
   */
  accountName?: string;

  /**
   * The customer name.
   *
   * @remarks
   * <br/> - Required when doing device-based authentication.
   */
  customerName?: string;

  /**
   * The friendly name of the customer.
   *
   * @remarks
   * <br/> - Required when doing device-based authentication.
   */
  friendlyName?: string;

  /**
   * The identifier of the portal.
   *
   * @remarks
   * <br/> - Required when doing device-based authentication.
   */
  portalId?: string;

  /**
   * The authentication token.
   *
   * @remarks
   * <br/> - This is a JSON web token provided by the Titanium Secure Token Server.
   * <br/> - Required when doing token-based authentication.
   */
  authToken?: string;
}

export interface DeviceBasedTitaniumIntegrationParameters extends TitaniumIntegrationParameters {
  /**
   * The account name.
   */
  accountName: string;

  /**
   * The customer name.
   */
  customerName: string;

  /**
   * The friendly name of this customer.
   */
  friendlyName: string;

  /**
   * The identifier of the portal.
   */
  portalId: string;

  /**
   * The authentication token.
   *
   * @remarks
   * <br/> - This is a JSON web token provided by the Titanium Secure Token Server.
   */
  authToken?: undefined;
}

/**
 * Describes the configuration of the Titanium DRM integration with token-based authentication.
 *
 * @public
 */
export interface TokenBasedTitaniumIntegrationParameters extends TitaniumIntegrationParameters {
  /**
   * The account name.
   */
  accountName?: undefined;

  /**
   * The customer name.
   */
  customerName?: undefined;

  /**
   * The friendly name of this customer.
   */
  friendlyName?: undefined;

  /**
   * The identifier of the portal.
   */
  portalId?: undefined;

  /**
   * The authentication token.
   *
   * @remarks
   * <br/> - This is a JSON web token provided by the Titanium Secure Token Server.
   */
  authToken: string;
}
