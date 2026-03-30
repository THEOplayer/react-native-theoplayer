/**
 * React hook to determine if a referenced HTMLDivElement is currently attached to the document.
 *
 * This hook checks if the provided ref's current element is attached to the DOM (document.body).
 * Returns a boolean indicating the attachment state.
 * Once attached, it will stop observing for changes to optimize performance.
 *
 * @param ref - React ref object pointing to an HTMLDivElement
 * @returns boolean - true if the element is attached to the document, false otherwise
 */
import { RefObject, useEffect, useState } from 'react';

/**
 * @param ref
 */
export const useIsAttached = (ref: RefObject<HTMLDivElement | null>) => {
  const [isAttached, setIsAttached] = useState<boolean>(false);

  useEffect(() => {
    if (!ref.current) return;

    const checkAttached = () => {
      const connected = ref.current?.isConnected ?? false;
      setIsAttached(connected);
      return connected;
    };

    if (checkAttached()) return;

    const observer: MutationObserver = new MutationObserver(() => {
      const attached = checkAttached();
      // Once attached, stop observing.
      if (attached) {
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [ref]);
  return isAttached;
};
