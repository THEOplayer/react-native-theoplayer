import type { Event } from './Event';

/**
 * The function to be executed when an event occurred.
 *
 * @category Events
 * @public
 */
export type EventListener<TEvent extends Event> = (event: TEvent) => void;
