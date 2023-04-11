/**
 * Object containing values used for the player's retry mechanisms.
 */
export interface RetryConfiguration {
  /**
   * The maximum amount of retries before the player throws a fatal error.
   * Defaults to `Infinity`.
   */
  readonly maxRetries?: number;

  /**
   * The initial delay in milliseconds before a retry request occurs.
   * Exponential backoff will be applied on this value.
   * Defaults to `200`.
   */
  readonly minimumBackoff?: number;

  /**
   * The maximum amount of delay in milliseconds between retry requests.
   * Defaults to `30000`.
   */
  readonly maximumBackoff?: number;
}
