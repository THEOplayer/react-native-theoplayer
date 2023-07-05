import { CachingTaskListEventType, MediaCache } from 'react-native-theoplayer';
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
    MediaCache.tasks.addEventListener(CachingTaskListEventType.addtask, taskListChangeListener);
    MediaCache.tasks.addEventListener(CachingTaskListEventType.removetask, taskListChangeListener);
    return () => {
      MediaCache.tasks.removeEventListener(CachingTaskListEventType.addtask, taskListChangeListener);
      MediaCache.tasks.removeEventListener(CachingTaskListEventType.removetask, taskListChangeListener);
    };
  }, []);
  return tasks;
};
