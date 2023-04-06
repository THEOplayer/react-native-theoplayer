import type { Event } from './Event';

/**
 * The function to be executed when an event occurred.
 *
 * @public
 */
export type EventListener<TEvent extends Event> = (event: TEvent) => void;
