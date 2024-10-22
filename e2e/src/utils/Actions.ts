// noinspection JSUnusedGlobalSymbols

import { ErrorEvent, type Event, PlayerEventType, THEOplayer } from 'react-native-theoplayer';

export interface TestOptions {
  timeout: number;
}

export const defaultTestOptions: TestOptions = {
  timeout: 10000,
};

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
  return withTimeOut(
    new Promise<Event<PlayerEventType>[]>((resolve, reject) => {
      const events: Event<PlayerEventType>[] = [];
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
          events.push(receivedEvent);
          console.debug('[waitForPlayerEvents]', `Received event '${JSON.stringify(receivedEvent.type)}' - waiting for ${expectedEvent.type}`);
          const index = eventMap.findIndex((e) => propsMatch(e.event, receivedEvent));
          const isExpected = index <= 0;

          // Check order
          if (inOrder && eventMap.length && !isExpected) {
            const err = `Expected event '${expectedEvent.type}'\nbut received '${receivedEvent.type}'`;
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
            resolve(events);
          }
        },
      }));
      player.addEventListener(PlayerEventType.ERROR, onError);
      eventMap.forEach(({ event, onEvent }) => player.addEventListener(event.type, onEvent));
    }),
    options.timeout,
  );
};

const withTimeOut = (promise: Promise<any>, timeout: number): Promise<any> => {
  return new Promise<void>((resolve, reject) => {
    const handle = setTimeout(() => {
      reject('Timeout waiting for event');
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

export function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${actual} to be ${expected} ❌`);
      }
      console.log(`Passed: ${actual} == ${expected} ✅`);
    },

    toEqual(expected: any) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)} ❌`);
      }
      console.log(`Passed: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)} ✅`);
    },

    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected ${actual} to be truthy ❌`);
      }
      console.log(`Passed: ${actual} is truthy ✅`);
    },

    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected ${actual} to be falsy ❌`);
      }
      console.log(`Passed: ${actual} is falsy ✅`);
    },
  };
}

function propsMatch(obj1: any, obj2: any): boolean {
  return Object.keys(obj1).every((key) => obj1[key] === obj2[key]);
}
