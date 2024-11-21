// noinspection JSUnusedGlobalSymbols

import { ErrorEvent, type Event, EventMap, PlayerEventType, SourceDescription, StringKeyOf, THEOplayer } from 'react-native-theoplayer';
import { getTestPlayer } from '../components/TestableTHEOplayerView';

export interface TestOptions {
  timeout: number;
}

export const defaultTestOptions: TestOptions = {
  timeout: 10000,
};

export async function preparePlayerWithSource(source: SourceDescription, autoplay: boolean = true): Promise<THEOplayer> {
  const player = await getTestPlayer();
  const eventsPromise = waitForPlayerEventType(player, PlayerEventType.SOURCE_CHANGE);
  const eventsPromiseAutoPlay = waitForPlayerEventTypes(player, [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING]);

  // Start autoplay
  player.autoplay = autoplay;
  player.source = source;

  // Wait for `sourcechange`, `play` and `playing` events.
  if (autoplay) {
    await eventsPromiseAutoPlay;
  } else {
    await eventsPromise;
  }
  return player;
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

export const waitForPlayerEvents = async <EType extends Event<PlayerEventType>>(
  player: THEOplayer,
  expectedEvents: Partial<EType>[],
  inOrder: boolean = true,
  options = defaultTestOptions,
): Promise<Event<PlayerEventType>[]> => {
  const receivedEvents: Event<PlayerEventType>[] = [];
  return withEventTimeOut(
    new Promise<Event<PlayerEventType>[]>((resolve, reject) => {
      const onError = (err: ErrorEvent) => {
        console.error('[waitForPlayerEvents]', err);
        player.removeEventListener(PlayerEventType.ERROR, onError);
        reject(err);
      };
      let eventMap = expectedEvents.map((_expected: Partial<EType>) => ({
        event: _expected as Event<PlayerEventType>,
        onEvent(receivedEvent: Event<PlayerEventType>) {
          if (!eventMap.length) {
            // No more events expected
            return;
          }
          const expectedEvent = eventMap[0].event;
          receivedEvents.push(receivedEvent);
          console.debug('[waitForPlayerEvents]', `Received event ${JSON.stringify(receivedEvent.type)} - waiting for ${expectedEvent.type}`);
          const index = eventMap.findIndex((e) => propsMatch(e.event, receivedEvent));
          const isExpected = index <= 0;

          // Check order
          if (inOrder && eventMap.length && !isExpected) {
            const err = `Expected event '${expectedEvent.type}' but received '${receivedEvent.type}'`;
            console.error('[waitForPlayerEvents]', err);
            reject(err);
          }
          eventMap = eventMap.filter((entry) => {
            if (entry.event.type === expectedEvent.type) {
              player.removeEventListener(expectedEvent.type, entry.onEvent);
            }
            return entry.event.type !== expectedEvent.type;
          });
          if (!eventMap.length) {
            // Done
            resolve(receivedEvents);
          }
        },
      }));
      player.addEventListener(PlayerEventType.ERROR, onError);
      eventMap.forEach(({ event, onEvent }) => player.addEventListener(event.type, onEvent));
    }),
    options.timeout,
    expectedEvents,
    receivedEvents,
  );
};

const withEventTimeOut = <TType extends StringKeyOf<EventMap<string>>, EType extends Event<TType>>(
  promise: Promise<any>,
  timeout: number,
  expectedEvents: Partial<EType>[],
  receivedEvents: EType[],
): Promise<any> => {
  return new Promise<void>((resolve, reject) => {
    const handle = setTimeout(() => {
      reject(
        `Timeout waiting for next event, expecting [${expectedEvents.map((ev) => JSON.stringify(ev)).join(',')}] ` +
          `already received [${receivedEvents.map((ev) => JSON.stringify(ev)).join(',')}]`,
      );
    }, timeout);
    promise
      .then((result: any) => {
        clearTimeout(handle);
        resolve(result);
      })
      .catch((reason) => {
        reject(reason);
      });
  });
};

export function expect(actual: any, desc?: string) {
  const descPrefix = desc ? `${desc}: ` : '';

  const logPass = (msg: string) => console.log(`${descPrefix}${msg} ✅`);
  const throwErr = (msg: string) => {
    throw new Error(`${descPrefix}${msg} ❌`);
  };

  return {
    toBe(expected: any) {
      if (actual === expected) logPass(`${actual} == ${expected}`);
      else throwErr(`Expected ${actual} to be ${expected}`);
    },

    toNotBe(expected: any) {
      if (actual !== expected) logPass(`${actual} != ${expected}`);
      else throwErr(`Expected ${actual} not to be ${expected}`);
    },

    toEqual(expected: any) {
      if (JSON.stringify(actual) === JSON.stringify(expected)) logPass(`Expected ${actual} to equal ${expected}`);
      else throwErr(`Expected ${actual} to equal ${expected}`);
    },

    toBeGreaterThan(expected: number) {
      if (actual > expected) logPass(`${actual} > ${expected}`);
      else throwErr(`Expected ${actual} to be greater than ${expected}`);
    },

    toBeGreaterThanOrEqual(expected: number) {
      if (actual >= expected) logPass(`${actual} >= ${expected}`);
      else throwErr(`Expected ${actual} to be greater than or equal to ${expected}`);
    },

    toBeSmallerThan(expected: number) {
      if (actual < expected) logPass(`${actual} < ${expected}`);
      else throwErr(`Expected ${actual} to be smaller than ${expected}`);
    },

    toBeSmallerThanOrEqual(expected: number) {
      if (actual <= expected) logPass(`${actual} <= ${expected}`);
      else throwErr(`Expected ${actual} to be smaller than or equal to ${expected}`);
    },

    toBeTruthy() {
      if (actual) logPass(`${actual} is truthy`);
      else throwErr(`Expected ${actual} to be truthy`);
    },

    toBeFalsy() {
      if (!actual) logPass(`${actual} is falsy`);
      else throwErr(`Expected ${actual} to be falsy`);
    },
  };
}

function propsMatch(obj1: any, obj2: any): boolean {
  return Object.keys(obj1).every((key) => obj1[key] === obj2[key]);
}
