/**
 * An error that is thrown by THEOplayer.
 *
 * @category Errors
 * @public
 */
export interface PlayerError {
  readonly errorCode: string;
  readonly errorMessage: string;
}
