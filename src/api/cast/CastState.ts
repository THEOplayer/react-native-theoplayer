/**
 * The state of a casting process, represented by a value from the following list:
 * <br/> - `'unavailable'`: No available cast devices.
 * <br/> - `'available'`: Cast device available, but the player is not connected.
 * <br/> - `'connecting'`: Cast device available and the player is connecting.
 * <br/> - `'connected'`: Cast device available and the player is connected.
 *
 * @public
 */
export type CastState = 'unavailable' | 'available' | 'connecting' | 'connected';
