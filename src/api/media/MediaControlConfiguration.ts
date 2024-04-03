/**
 * Describes the configuration of media controls and media sessions across platforms.
 *
 * For Android, this applies to the {@link https://developer.android.com/guide/topics/media-apps/working-with-a-media-session Media Session}
 * functionality, providing the platform with a uniform way of interacting with the player, and the
 * {@link https://developer.android.com/develop/ui/views/notifications Notification} to display information on the media currently playing.
 *
 * For Web, this applies to the {@link https://www.w3.org/TR/mediasession/ Media Session} API for customizing media notifications and access to
 * platform media keys.
 *
 * For iOS, this applies to the {@link https://developer.apple.com/documentation/mediaplayer/mpnowplayinginfocenter Now Playing} functionality for
 * setting information on the media that is currently playing, and the
 * {@link https://developer.apple.com/documentation/mediaplayer/mpremotecommandcenter Remote Command Center} responds to remote control events sent
 * by external accessories and system controls.
 */
export interface MediaControlConfiguration {
  /**
   * Whether the media session feature is enabled.
   *
   * @defaultValue `true`
   *
   * @remarks
   * <br/> - This only applies to Web.
   */
  readonly mediaSessionEnabled?: boolean;
}
