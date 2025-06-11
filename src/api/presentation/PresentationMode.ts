/**
 * The presentation mode of the player, represented by a value from the following list:
 * <br/> - `'inline'`: The player is shown in its original location on the page.
 * <br/> - `'fullscreen'`: The player fills the entire screen.
 * <br/> - `'picture-in-picture'`: The player is shown on top of the page (see {@link PiPConfiguration} for more options).
 *
 * @public
 */
export enum PresentationMode {
  fullscreen = 'fullscreen',
  inline = 'inline',
  pip = 'picture-in-picture',
}
