/**
 * The text track style API.
 *
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
   * <br/> - `rgba(255,0,0,0.5)` will set the color of the text to red, with 50% opacity.
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
   * The background color for the text track.
   *
   * @remarks
   * This targets the area directly behind the text.
   *
   * @example
   * <br/> - `red` will set the background color of the text track to red.
   * <br/> - `#ff0000` will set the background color of the text track to red.
   * <br/> - `rgba(255,0,0,0.5)` will set the background color of the text track to red, with 50% opacity.
   */
  backgroundColor: string | undefined;

  /**
   * The window color for the text track.
   *
   * @remarks
   * This targets the area covering the full width of the text track.
   *
   * @example
   * <br/> - `red` will set the background color of the window of the text track to red.
   * <br/> - `#ff0000` will set the background color of the window of the text track to red.
   * <br/> - `rgba(255,0,0,0.5)` will set the background color of the window of the text track to red, with 50% opacity.
   */
  windowColor: string | undefined;

  /**
   * The edge style of the text, represented by a value from the following list:
   * <br/> - `'none'`
   * <br/> - `'dropshadow'`
   * <br/> - `'raised'`
   * <br/> - `'depressed'`
   * <br/> - `'uniform`
   */
  edgeStyle: EdgeStyle | undefined;
}

/**
 * The style of the edge, represented by a value from the following list:
 * <br/> - `'none'`
 * <br/> - `'dropshadow'`
 * <br/> - `'raised'`
 * <br/> - `'depressed'`
 * <br/> - `'uniform'`
 *
 * @public
 */
export type EdgeStyle = 'none' | 'dropshadow' | 'raised' | 'depressed' | 'uniform';
