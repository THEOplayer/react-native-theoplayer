/**
 * An error that is thrown by THEOplayer.
 *
 * @category Errors
 * @category Player
 * @public
 */
export interface PlayerError {
  readonly errorCode: string;
  readonly errorMessage: string;
}
