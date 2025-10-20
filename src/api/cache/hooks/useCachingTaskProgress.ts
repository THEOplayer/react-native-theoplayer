import { CachingTask, CachingTaskEventType } from 'react-native-theoplayer';
import { useEffect, useState } from 'react';

/**
 * A convenience hook that keeps the progress value of a caching task.
 *
 * @category Caching
 * @public
 */
export const useCachingTaskProgress = (task: CachingTask, debug = true) => {
  const [progress, setProgress] = useState<number | undefined>(task.percentageCached);
  useEffect(() => {
    const onProgress = () => {
      const percentageCached = task.percentageCached;
      if (debug) {
        console.log('[MediaCache] progress change', percentageCached);
      }
      setProgress(percentageCached);
    };
    task.addEventListener(CachingTaskEventType.progress, onProgress);
    return () => {
      task.removeEventListener(CachingTaskEventType.progress, onProgress);
    };
  }, [task, debug]);
  return progress;
};
