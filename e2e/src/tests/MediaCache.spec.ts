import { TestScope } from 'cavy';
import { TestSourceDescription, TestSources } from '../utils/SourceUtils';
import { CacheEventType, CachingTask, CachingTaskEventType, MediaCache } from 'react-native-theoplayer';
import { expect } from '../utils/Actions';

export default function (spec: TestScope) {
  TestSources()
    .withPlain()
    .forEach((testSource: TestSourceDescription) => {
      spec.describe(`Caching source ${testSource.description} for offline playback`, function () {
        spec.it('creates a caching task, dispatched events and correctly starts the task.', async function () {
          const addTaskEventPromise = waitForCacheEvent(CacheEventType.addtask);

          const task = await MediaCache.createTask(testSource.source, {
            amount: '100%',
            expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          });

          // CacheEventType.addtask event should have been dispatched.
          await addTaskEventPromise;

          const statusChangeEventPromise = waitForCachingTaskEvent(task, CachingTaskEventType.statechange);

          // A task should have been created.
          expect(task).toBeTruthy();

          task.start();

          // Wait for state change
          await statusChangeEventPromise;
        });
      });
    });
}

async function waitForCacheEvent(eventType: CacheEventType, timeout: number = 10000): Promise<void> {
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

async function waitForCachingTaskEvent(task: CachingTask, eventType: CachingTaskEventType, timeout: number = 10000): Promise<void> {
  return new Promise((resolve, reject) => {
    const handle = setTimeout(() => {
      reject();
    }, timeout);
    task.addEventListener(eventType, () => {
      clearTimeout(handle);
      resolve();
    });
  });
}
