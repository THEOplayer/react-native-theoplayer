/**
 * The chromecast error code, represented by a value from the following list:
 * <br/> - `'CANCEL'`: The operation was canceled by the user.
 * <br/> - `'TIMEOUT'`: The operation timed out.
 * <br/> - `'API_NOT_INITIALIZED'`: The API is not initialized.
 * <br/> - `'INVALID_PARAMETER'`: The parameters to the operation were not valid.
 * <br/> - `'EXTENSION_NOT_COMPATIBLE'`: The API script is not compatible with the installed Cast extension.
 * <br/> - `'EXTENSION_MISSING'`: The Cast extension is not available.
 * <br/> - `'RECEIVER_UNAVAILABLE'`: No receiver was compatible with the session request.
 * <br/> - `'SESSION_ERROR'`: A session could not be created, or a session was invalid.
 * <br/> - `'CHANNEL_ERROR'`: A channel to the receiver is not available.
 * <br/> - `'LOAD_MEDIA_FAILED'`: Load media failed.
 *
 * @remarks
 * <br/> - The error codes correspond to the error codes documented in the {@link https://developers.google.com/cast/docs/reference/chrome/chrome.cast.html#.ErrorCode | Chromecast API reference}.
 *
 * @category Errors
 * @public
 */
export type ChromecastErrorCode =
  | 'CANCEL'
  | 'TIMEOUT'
  | 'API_NOT_INITIALIZED'
  | 'INVALID_PARAMETER'
  | 'EXTENSION_NOT_COMPATIBLE'
  | 'EXTENSION_MISSING'
  | 'RECEIVER_UNAVAILABLE'
  | 'SESSION_ERROR'
  | 'CHANNEL_ERROR'
  | 'LOAD_MEDIA_FAILED';

/**
 * An error that occurred while casting or attempting to cast to Chromecast.
 *
 * @category Error
 * @public
 */
export interface ChromecastError {
  /**
   * The error code of the error.
   */
  errorCode: ChromecastErrorCode;

  /**
   * The human-readable description of the error.
   */
  description: string;
}
