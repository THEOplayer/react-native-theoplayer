/**
 * The text track style API.
 *
 * @category Media and Text Tracks
 * @public
 */
export interface TextTrackStyle {
  /**
   * The font family for the text track.
   */
  fontFamily: string | undefined;

  /**
   * The font color for the text track.
   *
   * @example
   * <br/> - `red` will set the color of the text to red.
   * <br/> - `#ff0000` will set the color of the text to red.
   * <br/> - Available for Web only: `rgba(255,0,0,0.5)` will set the color of the text to red, with 50% opacity.
   */
  fontColor: string | undefined;

  /**
   * The font size for the text track.
   *
   * @remarks
   * Can be a percentage value such as '50%', '75%', '100%', '150%' or '200%'.
   */
  fontSize: string | undefined;

  /**
   * The path to a font in the Android `app/src/main/assets/` folder.
   * 
   * @remarks
   * Only supported on Android.
   */
  fontPath: string | undefined;

  /**
   * The background color for the text track.
   *
   * @remarks
   * This targets the area directly behind the text.
   *
   * @example
   * <br/> - `red` will set the background color of the text track to red.
   * <br/> - `#ff0000` will set the background color of the text track to red.
   * <br/> - Available for Web only: `rgba(255,0,0,0.5)` will set the background color of the text track to red, with 50% opacity.
   */
  backgroundColor: string | undefined;

  /**
   * The window color for the text track.
   *
   * @platform web,android
   *
   * @remarks
   * <br/> - This targets the area covering the full width of the text track.
   *
   * @example
   * <br/> - `red` will set the background color of the window of the text track to red.
   * <br/> - `#ff0000` will set the background color of the window of the text track to red.
   * <br/> - Available for Web only: `rgba(255,0,0,0.5)` will set the background color of the window of the text track to red, with 50% opacity.
   */
  windowColor: string | undefined;

  /**
   * The edge style of the text, represented by a value from the following list:
   * <br/> - `'none'`
   * <br/> - `'dropshadow'`
   * <br/> - `'raised'`
   * <br/> - `'depressed'`
   * <br/> - `'uniform'`
   */
  edgeStyle: EdgeStyle | undefined;

  /**
   * The edge color for the text track.
   *
   * @platform android
   */
  edgeColor: string | undefined;

  /**
   * The top margin of the area where subtitles are being rendered.
   *
   * @remarks
   * <br/> - The margin is in number of pixels.
   */
  marginTop: number | undefined;

  /**
   * The bottom margin of the area where subtitles are being rendered.
   *
   * @platform web,android
   *
   * @remarks
   * <br/> - The margin is in number of pixels.
   */
  marginBottom: number | undefined;
  /**
   * The left margin of the area where subtitles are being rendered.
   *
   * @remarks
   * <br/> - The margin is in number of pixels.
   */
  marginLeft: number | undefined;
  /**
   * The right margin  of the area where subtitles are being rendered.
   *
   * @platform web,android
   *
   * @remarks
   * <br/> - The margin is in number of pixels.
   * <br/> - Useful for pushing the subtitles left, so they don't overlap with the UI.
   */
  marginRight: number | undefined;
}

/**
 * The style of the edge, represented by a value from the following list:
 * <br/> - `'none'`
 * <br/> - `'dropshadow'`
 * <br/> - `'raised'`
 * <br/> - `'depressed'`
 * <br/> - `'uniform'`
 *
 * @category Media and Text Tracks
 * @public
 */
export enum EdgeStyle {
  none = 'none',
  dropshadow = 'dropshadow',
  raised = 'raised',
  depressed = 'depressed',
  uniform = 'uniform',
}
