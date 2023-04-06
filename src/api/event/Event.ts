/**
 * Fired when an event occurs.
 *
 * @public
 */
export interface Event<TType extends string = string> {
  /**
   * The type of the event.
   */
  type: TType;

  /**
   * The creation date of the event.
   */
  date: Date;
}
