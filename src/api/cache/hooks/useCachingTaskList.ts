import { CacheEventType, MediaCache } from 'react-native-theoplayer';
import { useEffect, useState } from 'react';

/**
 * A convenience hook that keeps a list of all caching tasks.
 *
 * @category Caching
 * @public
 */
export const useCachingTaskList = (debug = false) => {
  const [tasks, setTasks] = useState([...MediaCache.tasks]);
  useEffect(() => {
    const taskListChangeListener = () => {
      if (debug) {
        console.log('[MediaCache] task list changed: ', MediaCache.tasks);
      }
      setTasks([...MediaCache.tasks]);
    };
    MediaCache.addEventListener(CacheEventType.addtask, taskListChangeListener);
    MediaCache.addEventListener(CacheEventType.removetask, taskListChangeListener);
    MediaCache.addEventListener(CacheEventType.statechange, taskListChangeListener);
    return () => {
      MediaCache.removeEventListener(CacheEventType.addtask, taskListChangeListener);
      MediaCache.removeEventListener(CacheEventType.removetask, taskListChangeListener);
      MediaCache.addEventListener(CacheEventType.statechange, taskListChangeListener);
    };
  }, []);
  return tasks;
};
