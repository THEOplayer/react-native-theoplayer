// noinspection JSUnusedGlobalSymbols

import {
  AdEvent,
  AdEventType,
  ErrorEvent,
  type Event,
  EventMap,
  PlayerEventType,
  SourceDescription,
  StringKeyOf,
  THEOplayer,
} from 'react-native-theoplayer';
import { getTestPlayer } from '../components/TestableTHEOplayerView';
import { logPlayerBuffer } from './PlayerUtils';
import { Log } from './Log';

export interface TestOptions {
  timeout: number;
}

export const defaultTestOptions: TestOptions = {
  timeout: 30000,
};

export async function preparePlayerWithSource(source: SourceDescription, autoplay: boolean = true): Promise<THEOplayer> {
  const player = await getTestPlayer();
  let startUpPromise: Promise<Event<PlayerEventType>[]>;
  if (autoplay) {
    startUpPromise = waitForPlayerEventTypes(player, [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING]);
  } else {
    startUpPromise = waitForPlayerEventType(player, PlayerEventType.SOURCE_CHANGE);
  }

  // Start autoplay
  player.autoplay = autoplay;
  player.source = source;

  // Wait for either `sourcechange` only or the `sourcechange`, `play` and `playing` combination.
  await startUpPromise;
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

let eventListIndex = 0; // increments for every playerEvent list that is evaluated.
export const waitForPlayerEvents = async <EType extends Event<PlayerEventType>>(
  player: THEOplayer,
  expectedEvents: Partial<EType>[],
  inOrder: boolean = true,
  options = defaultTestOptions,
): Promise<Event<PlayerEventType>[]> => {
  const receivedEvents: Event<PlayerEventType>[] = [];
  const eventTimestamps = new Map<string, number>();
  const eventsPromise = new Promise<Event<PlayerEventType>[]>((resolve, reject) => {
    const onError = (err: ErrorEvent) => {
      Log.error('[waitForPlayerEvents]', err);
      player.removeEventListener(PlayerEventType.ERROR, onError);
      reject(err);
    };
    const onAdError = (e: AdEvent) => {
      if (e.subType === AdEventType.AD_ERROR) {
        const err = 'Ad error';
        Log.error('[waitForPlayerEvents]', err);
        player.removeEventListener(PlayerEventType.AD_EVENT, onAdError);
        reject(err);
      }
    };
    const TAG: string = `[waitForPlayerEvents] eventList ${eventListIndex}:`;
    eventListIndex += 1;

    let unReceivedEvents = [...expectedEvents];
    const uniqueEventTypes = [...new Set(unReceivedEvents.map((event) => event.type))];
    uniqueEventTypes.forEach((eventType) => {
      const onEvent = (receivedEvent: Event<PlayerEventType>) => {
        receivedEvents.push(receivedEvent);
        eventTimestamps.set(receivedEvent.type, Date.now());
        Log.debug(TAG, `Added timestamp for ${receivedEvent.type} event.`);
        logDelayFromPreviousEvent(eventTimestamps, TAG);
        Log.debug(TAG, `Handling received event ${JSON.stringify(receivedEvent)}`);
        if (inOrder && unReceivedEvents.length) {
          const expectedEvent = unReceivedEvents[0];
          Log.debug(TAG, `Was waiting for ${JSON.stringify(expectedEvent)}`);

          // Received events must either not be in the expected, or be the first
          const index = unReceivedEvents.findIndex((e) => propsMatch(e, receivedEvent));
          if (index > 0) {
            const err = `Expected '${expectedEvent.type}' event but received '${receivedEvent.type} event'`;
            Log.error(TAG, err);
            reject(err);
          } else {
            Log.debug(TAG, `Received ${receivedEvent.type} event was expected.`);
          }
        }

        unReceivedEvents = unReceivedEvents.filter((event) => {
          // When found, remove the listener
          if (propsMatch(event, receivedEvent)) {
            Log.debug(TAG, `   -> removing: ${JSON.stringify(event)}`);
            return false;
          }
          // Only keep the unreceived events
          Log.debug(TAG, `   -> keeping: ${JSON.stringify(event)}`);
          return true;
        });

        // remove listener if no other unreceived events require it.
        if (!unReceivedEvents.find((event) => event.type === receivedEvent.type)) {
          Log.debug(TAG, `Removing listener for ${receivedEvent.type} from player`);
          player.removeEventListener(receivedEvent.type, onEvent);
        }

        if (!unReceivedEvents.length) {
          // Finished
          Log.debug(TAG, `Resolving promise on received events.`);
          resolve(receivedEvents);
        }
      };

      player.addEventListener(eventType as PlayerEventType, onEvent);
      Log.debug(TAG, `Added listener for ${eventType} to the player`);
    });
    player.addEventListener(PlayerEventType.ERROR, onError);
    player.addEventListener(PlayerEventType.AD_EVENT, onAdError);
  });

  // Add rejection on time-out
  const timeOutPromise = withEventTimeOut(eventsPromise, options.timeout, expectedEvents, receivedEvents);

  // Add extra logging on error
  return withPlayerStateLogOnError(player, timeOutPromise);
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

const withPlayerStateLogOnError = async (player: THEOplayer, promise: Promise<any>) => {
  try {
    return await promise;
  } catch (e) {
    throw (
      (typeof e === 'string' ? e : JSON.stringify(e)) +
      ` buffer: ${logPlayerBuffer(player)};` +
      ` currentTime: ${player.currentTime};` +
      ` paused: ${player.paused};`
    );
  }
};

export function expect(actual: any, desc?: string) {
  const descPrefix = desc ? `${desc}: ` : '';

  const logPass = (msg: string) => Log.log(`${descPrefix}${msg} ✅`);
  const throwErr = (msg: string) => {
    throw new Error(`${descPrefix}${msg} ❌`);
  };

  return {
    toBe(expected: any) {
      if (actual === expected) logPass(`${actual} == ${expected}`);
      else {
        const errorMessage = `Expected ${actual} to be ${expected}`;
        Log.error(`[EXPECTATION NOT MET]: ${errorMessage}`);
        throwErr(errorMessage);
      }
    },

    toNotBe(expected: any) {
      if (actual !== expected) logPass(`${actual} != ${expected}`);
      else {
        const errorMessage = `Expected ${actual} not to be ${expected}`;
        Log.error(`[EXPECTATION NOT MET]: ${errorMessage}`);
        throwErr(errorMessage);
      }
    },

    toEqual(expected: any) {
      if (JSON.stringify(actual) === JSON.stringify(expected)) logPass(`Expected ${actual} to equal ${expected}`);
      else {
        const errorMessage = `Expected ${actual} to equal ${expected}`;
        Log.error(`[EXPECTATION NOT MET]: ${errorMessage}`);
        throwErr(errorMessage);
      }
    },

    toBeGreaterThan(expected: number) {
      if (actual > expected) logPass(`${actual} > ${expected}`);
      else {
        const errorMessage = `Expected ${actual} to be greater than ${expected}`;
        Log.error(`[EXPECTATION NOT MET]: ${errorMessage}`);
        throwErr(errorMessage);
      }
    },

    toBeGreaterThanOrEqual(expected: number) {
      if (actual >= expected) logPass(`${actual} >= ${expected}`);
      else {
        const errorMessage = `Expected ${actual} to be greater than or equal to ${expected}`;
        Log.error(`[EXPECTATION NOT MET]: ${errorMessage}`);
        throwErr(errorMessage);
      }
    },

    toBeSmallerThan(expected: number) {
      if (actual < expected) logPass(`${actual} < ${expected}`);
      else {
        const errorMessage = `Expected ${actual} to be smaller than ${expected}`;
        Log.error(`[EXPECTATION NOT MET]: ${errorMessage}`);
        throwErr(errorMessage);
      }
    },

    toBeSmallerThanOrEqual(expected: number) {
      if (actual <= expected) logPass(`${actual} <= ${expected}`);
      else {
        const errorMessage = `Expected ${actual} to be smaller than or equal to ${expected}`;
        Log.error(`[EXPECTATION NOT MET]: ${errorMessage}`);
        throwErr(errorMessage);
      }
    },

    toBeTruthy() {
      if (actual) logPass(`${actual} is truthy`);
      else {
        const errorMessage = `Expected ${actual} to be truthy`;
        Log.error(`[EXPECTATION NOT MET]: ${errorMessage}`);
        throwErr(errorMessage);
      }
    },

    toBeFalsy() {
      if (!actual) logPass(`${actual} is falsy`);
      else {
        const errorMessage = `Expected ${actual} to be falsy`;
        Log.error(`[EXPECTATION NOT MET]: ${errorMessage}`);
        throwErr(errorMessage);
      }
    },
  };
}

function propsMatch(obj1: any, obj2: any): boolean {
  return Object.keys(obj1).every((key) => obj1[key] === obj2[key]);
}

function logDelayFromPreviousEvent(eventTimestamps: Map<string, number>, tag: string) {
  const entries = Array.from(eventTimestamps.entries()).sort((a, b) => b[1] - a[1]); // sort descending by timestamp
  if (entries.length >= 2) {
    const [lastType, lastTime] = entries[0];
    const [secondLastType, secondLastTime] = entries[1];
    const diffSeconds = ((lastTime - secondLastTime) / 1000).toFixed(2);
    Log.debug(tag, `Time between ${lastType} and ${secondLastType} is ${diffSeconds} seconds`);
  }
}
