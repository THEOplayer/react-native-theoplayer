/**
 * Describes the configuration of Google IMA.
 *
 * @internal
 */
export interface GoogleImaConfiguration {
  /**
   * Whether the native (mobile) IMA implementation will be used.
   *
   * @deprecated This property applies to native web-based player SDKs and will be removed.
   * @internal
   */
  useNativeIma: boolean;
}
