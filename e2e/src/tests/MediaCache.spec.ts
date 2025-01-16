import { TestScope } from 'cavy';
import { TestSourceDescription, TestSources } from '../utils/SourceUtils';
import { CacheEventType, CacheStatus, CachingTask, MediaCache } from 'react-native-theoplayer';
import { expect } from '../utils/Actions';
import { getTestPlayer } from '../components/TestableTHEOplayerView';

const DEFAULT_EVENT_TIMEOUT_MS = 10000;

export default function (spec: TestScope) {
  TestSources()
    .withPlain()
    .forEach((testSource: TestSourceDescription) => {
      spec.describe(`Caching source ${testSource.description} for offline playback`, function () {
        spec.it('creates a caching task, dispatched events and correctly starts the task.', async function () {
          await getTestPlayer();

          console.debug('Wait for cache initialization');
          if (MediaCache.status !== CacheStatus.initialised) {
            await waitForCacheEvent(CacheEventType.statechange);
          }

          console.debug('Remove any old caching tasks', MediaCache.tasks.length);
          await new Promise((resolve: (value: void) => void) => {
            MediaCache.tasks.forEach((task: CachingTask) => {
              task.remove();
            });
            resolve();
          });

          console.debug('Creating caching task');
          const addTaskEventPromise = waitForCacheEvent(CacheEventType.addtask);
          await MediaCache.createTask(testSource.source, {
            amount: '100%',
            expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          });

          console.debug('Should have received a valid caching task');
          const task = MediaCache.tasks.length > 0 ? MediaCache.tasks[0] : null;
          expect(task?.id).toBeTruthy();

          console.debug('Should have received a CacheEventType.addtask');
          await addTaskEventPromise;
        });
      });
    });
}

async function waitForCacheEvent(eventType: CacheEventType, timeout: number = DEFAULT_EVENT_TIMEOUT_MS): Promise<void> {
  return new Promise((resolve, reject) => {
    const handle = setTimeout(() => {
      reject();
    }, timeout);
    MediaCache.addEventListener(eventType, () => {
      clearTimeout(handle);
      resolve();
    });
  });
}
