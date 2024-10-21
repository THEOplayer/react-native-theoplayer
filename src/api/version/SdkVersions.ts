export interface SdkVersions {
  /**
   * The version of the react-native SDK.
   *
   * @public
   */
  readonly rn: string;

  /**
   * The version of the native SDK dependency, if that applies.
   *
   * @public
   */
  readonly native?: string;
}
