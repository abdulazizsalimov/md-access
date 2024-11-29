import { useEffect, useRef } from 'react';

export const useResizeObserver = (
  elementRef: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  const observer = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      observer.current = new ResizeObserver(callback);
      observer.current.observe(elementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [elementRef, callback]);
};