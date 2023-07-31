import { CacheEventType, MediaCache } from 'react-native-theoplayer';
import { useEffect, useState } from 'react';

export const useCachingTaskList = (debug = false) => {
  const [tasks, setTasks] = useState([...MediaCache.tasks]);
  useEffect(() => {
    const taskListChangeListener = () => {
      if (debug) {
        console.log('[MediaCache] task list changed: ', MediaCache.tasks);
      }
      setTasks([...MediaCache.tasks]);
    };
    console.log('TVL', 'useCachingTaskList', 'addtask listener');
    MediaCache.addEventListener(CacheEventType.addtask, taskListChangeListener);
    MediaCache.addEventListener(CacheEventType.removetask, taskListChangeListener);
    return () => {
      console.log('TVL', 'useCachingTaskList', 'removetask listener');
      MediaCache.removeEventListener(CacheEventType.addtask, taskListChangeListener);
      MediaCache.removeEventListener(CacheEventType.removetask, taskListChangeListener);
    };
  }, []);
  return tasks;
};
