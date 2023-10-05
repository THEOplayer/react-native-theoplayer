import { CacheTaskStatus, CachingTask, CachingTaskEventType } from 'react-native-theoplayer';
import { useEffect, useState } from 'react';

export const useCachingTaskStatus = (task: CachingTask, debug = false) => {
  const [status, setStatus] = useState<CacheTaskStatus | undefined>(task.status);
  useEffect(() => {
    const onStateChange = () => {
      const status = task.status;
      if (debug) {
        console.log('[MediaCache] state change', status);
      }
      setStatus(status);
    };
    task.addEventListener(CachingTaskEventType.statechange, onStateChange);
    return () => {
      task.removeEventListener(CachingTaskEventType.statechange, onStateChange);
    };
  }, []);
  return status;
};
