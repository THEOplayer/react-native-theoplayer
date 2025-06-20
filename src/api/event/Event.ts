/**
 * Dispatched when an event occurs.
 *
 * @category Events
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
