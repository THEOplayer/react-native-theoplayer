import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { getTestPlayer } from '../components/TestableTHEOplayerView';

export interface TestOptions {
  timeout: number;
}

export const defaultTestOptions: TestOptions = {
  timeout: 10000,
};

export const failOnPlayerError = async () => {
  const player = await getTestPlayer();
  player.addEventListener(PlayerEventType.ERROR, (event) => {
    const { errorCode, errorMessage } = event.error;
    throw Error(`An error occurred: ${errorCode} ${errorMessage}`);
  });
}

export const applyActionAndExpectPlayerEvents = async (
  action: (player: THEOplayer) => Promise<void> | void,
  events: PlayerEventType[],
  options: TestOptions = defaultTestOptions,
) => {
  const player = await getTestPlayer();
  const eventsPromise = withTimeOut(expectPlayerEvents(events, false), options.timeout);
  await action(player);
  await eventsPromise;
};

export const applyActionAndExpectPlayerEventsInOrder = async (
  action: (player: THEOplayer) => Promise<void> | void,
  events: PlayerEventType[],
  options: TestOptions = defaultTestOptions,
) => {
  const player = await getTestPlayer();
  const eventsPromise = withTimeOut(expectPlayerEvents(events, true), options.timeout);
  await action(player);
  await eventsPromise;
};

const withTimeOut = (promise: Promise<void>, timeout: number) => {
  return new Promise<void>(async (resolve, reject) => {
    const handle = setTimeout(() => {
      reject('Timeout waiting for event');
    }, timeout);
    await promise;
    clearTimeout(handle);
    resolve();
  });
};

const expectPlayerEvents = async (eventTypes: PlayerEventType[], inOrder: boolean): Promise<void> => {
  const player = await getTestPlayer();
  return new Promise<void>((resolve, reject) => {
    let eventMap = eventTypes.map(type => ({
      eventType: type,
      onEvent() {
        if (inOrder && eventMap[0].eventType !== type) {
          const err = `Expected event '${eventMap[0].eventType}' but received '${type}'`;
          console.error('[expectPlayerEvents]', err);
          reject(err);
        }
        console.debug('[expectPlayerEvents]', `Received event '${type}'`);
        eventMap = eventMap.filter(event => {
          if (event.eventType === type) {
            player.removeEventListener(type, event.onEvent);
          }
          return event.eventType !== type;
        });
        if (!eventMap.length) {
          resolve();
        }
      }
    }));
    eventMap.forEach(({ eventType, onEvent }) => player.addEventListener(eventType, onEvent));
  });
};
