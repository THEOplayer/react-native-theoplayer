// A player-specific test layer on top of react-native-cavynext.
//
// The player under test is registered in cavynext's TestHookStore (see
// TestableTHEOplayerView), so specs obtain it through the regular cavynext
// component lookup instead of a module-level global:
//
//   const player = await getTestPlayer(spec);
//
// All wait helpers reject with a `PlayerEventTimeoutError` (or the player's
// own error) carrying a snapshot of the player state at the moment of
// failure.

import { AdEvent, AdEventType, type Event, PlayerEventType, SourceDescription, THEOplayer } from 'react-native-theoplayer';
import type { TestScope } from 'react-native-cavynext';
import { logPlayerBuffer } from './PlayerUtils';
import { Log } from './Log';

// The identifier under which TestableTHEOplayerView registers the player in
// the cavynext TestHookStore.
export const PLAYER_HOOK_ID = 'Scene.player';

// Time given to a freshly created native player before a test uses it.
const PLAYER_SETTLE_TIME = 1000;

export interface TestOptions {
  timeout: number;
}

export const defaultTestOptions: TestOptions = {
  timeout: 120000, // 2 minutes
};

// Thrown when the expected events do not arrive in time. Carries the player
// state snapshot so a CI log tells you where playback got stuck.
export class PlayerEventTimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlayerEventTimeoutError';
  }
}

/**
 * Obtain the player under test through the cavynext test hook store.
 *
 * The player is registered by TestableTHEOplayerView when it is ready and
 * removed when it is destroyed, so this waits (up to the Tester's `waitTime`)
 * for the current player instance.
 *
 * The runner re-mounts the view before every test, so the player handed out
 * here is often only milliseconds old while its predecessor is still being
 * released natively. The settle time keeps the two lifecycles apart.
 */
export async function getTestPlayer(spec: TestScope): Promise<THEOplayer> {
  const player = await spec.findComponent(PLAYER_HOOK_ID);
  await new Promise((resolve) => setTimeout(resolve, PLAYER_SETTLE_TIME));
  return player as unknown as THEOplayer;
}

/**
 * Set a source on the player under test and wait for it to be ready:
 * `sourcechange` only without autoplay, or `sourcechange`, `play` and
 * `playing` in order with autoplay.
 */
export async function preparePlayerWithSource(spec: TestScope, source: SourceDescription, autoplay: boolean = true): Promise<THEOplayer> {
  const player = await getTestPlayer(spec);
  const expected = autoplay ? [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING] : [PlayerEventType.SOURCE_CHANGE];

  // Attach the listeners before touching the player, so no event can be missed.
  const startUpPromise = waitForPlayerEventTypes(player, expected, autoplay);

  player.autoplay = autoplay;
  player.source = source;

  await startUpPromise;
  return player;
}

/**
 * Seek the player and wait for the `seeked` event.
 */
export async function seekTo(player: THEOplayer, time: number, options = defaultTestOptions): Promise<void> {
  const seekedPromise = waitForPlayerEventType(player, PlayerEventType.SEEKED, options);
  player.currentTime = time;
  await seekedPromise;
}

export const waitForPlayerEventType = async (
  player: THEOplayer,
  type: PlayerEventType,
  options = defaultTestOptions,
): Promise<Event<PlayerEventType>[]> => {
  return waitForPlayerEventTypes(player, [type], false, options);
};

export const waitForPlayerEventTypes = async (
  player: THEOplayer,
  eventTypes: PlayerEventType[],
  inOrder: boolean = true,
  options = defaultTestOptions,
): Promise<Event<PlayerEventType>[]> => {
  return waitForPlayerEvents(
    player,
    eventTypes.map((type) => ({ type })),
    inOrder,
    options,
  );
};

export const waitForPlayerEvent = async <EType extends Event<PlayerEventType>>(
  player: THEOplayer,
  expectedEvent: Partial<EType>,
  options = defaultTestOptions,
): Promise<Event<PlayerEventType>[]> => {
  return waitForPlayerEvents(player, [expectedEvent], false, options);
};

// Increments for every wait, to tell overlapping waits apart in the logs.
let waitIndex = 0;

/**
 * Wait until the player has dispatched all expected events.
 *
 * expectedEvents - partial events; every own property must match the received
 *                  event (e.g. `{ type: 'adevent', subType: 'adbegin' }`).
 * inOrder        - when true, an expected event arriving before an earlier
 *                  expected event fails the wait. Unrelated events are
 *                  always ignored.
 *
 * Resolves with the events received, in arrival order. Rejects on player
 * error, ad error, or timeout - always with an Error whose message includes
 * a snapshot of the player state.
 */
export const waitForPlayerEvents = async <EType extends Event<PlayerEventType>>(
  player: THEOplayer,
  expectedEvents: Partial<EType>[],
  inOrder: boolean = true,
  options = defaultTestOptions,
): Promise<Event<PlayerEventType>[]> => {
  const TAG = `[waitForPlayerEvents ${waitIndex++}]`;
  const receivedEvents: Event<PlayerEventType>[] = [];

  // Everything registered on the player, so cleanup is a single loop however
  // the wait ends (success, error, or timeout).
  const attached: [PlayerEventType, (event: any) => void][] = [];
  const listen = (type: PlayerEventType, listener: (event: any) => void) => {
    player.addEventListener(type, listener);
    attached.push([type, listener]);
  };
  const cleanup = () => {
    for (const [type, listener] of attached) {
      player.removeEventListener(type, listener);
    }
    attached.length = 0;
  };

  let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

  const eventsPromise = new Promise<Event<PlayerEventType>[]>((resolve, reject) => {
    const unReceivedEvents = [...expectedEvents];
    let lastEventTime = Date.now();

    const fail = (error: Error) => {
      Log.error(TAG, error.message);
      reject(error);
    };

    listen(PlayerEventType.ERROR, (event) => {
      fail(new Error(`Player error: ${JSON.stringify(event.error ?? event)}`));
    });
    listen(PlayerEventType.AD_EVENT, (event: AdEvent) => {
      if (event.subType === AdEventType.AD_ERROR) {
        fail(new Error(`Ad error: ${JSON.stringify(event.ad ?? event)}`));
      }
    });

    const onEvent = (receivedEvent: Event<PlayerEventType>) => {
      // Ignore events this wait is not interested in (the ERROR/AD_EVENT
      // watchers above have their own listeners).
      if (!unReceivedEvents.some((event) => event.type === receivedEvent.type)) {
        return;
      }

      receivedEvents.push(receivedEvent);
      const now = Date.now();
      Log.debug(TAG, `Received ${describeEvent(receivedEvent)} after ${((now - lastEventTime) / 1000).toFixed(2)}s`);
      lastEventTime = now;

      const index = unReceivedEvents.findIndex((event) => propsMatch(event, receivedEvent));
      if (index < 0) {
        // Same type but non-matching properties (e.g. another adevent
        // subType): not one of ours, ignore it.
        return;
      }
      if (inOrder && index > 0) {
        fail(new Error(`Expected ${describeEvent(unReceivedEvents[0])} but received ${describeEvent(receivedEvent)}`));
        return;
      }

      unReceivedEvents.splice(index, 1);
      if (unReceivedEvents.length === 0) {
        resolve(receivedEvents);
      }
    };

    for (const eventType of new Set(expectedEvents.map((event) => event.type))) {
      listen(eventType as PlayerEventType, onEvent);
    }

    timeoutHandle = setTimeout(() => {
      fail(
        new PlayerEventTimeoutError(
          `Timeout waiting for ${unReceivedEvents.map(describeEvent).join(', ')}; ` +
            `already received [${receivedEvents.map(describeEvent).join(', ')}]`,
        ),
      );
    }, options.timeout);
  });

  try {
    return await eventsPromise;
  } catch (e) {
    throw withPlayerState(e, player);
  } finally {
    clearTimeout(timeoutHandle);
    cleanup();
  }
};

// Append a snapshot of the player state to an error, preserving the original
// error type and stack.
function withPlayerState(e: unknown, player: THEOplayer): Error {
  const error = e instanceof Error ? e : new Error(String(e));
  error.message += ` (buffer: ${logPlayerBuffer(player)};` + ` currentTime: ${player.currentTime};` + ` paused: ${player.paused})`;
  return error;
}

// Compact, single-line description of a (partial) event for logs and errors.
function describeEvent(event: Partial<Event<PlayerEventType>>): string {
  const subType = (event as Partial<AdEvent>).subType;
  return `'${event.type}${subType ? `/${subType}` : ''}'`;
}

// Every own property of `expected` matches the received event.
function propsMatch(expected: any, received: any): boolean {
  return Object.keys(expected).every((key) => expected[key] === received[key]);
}
