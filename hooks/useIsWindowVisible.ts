import { useEffect, useState } from 'react';

const VISIBILITY_STATE_SUPPORTED =
  typeof window !== 'undefined' && 'visibilityState' in window.document;

function isWindowVisible() {
  if (!VISIBILITY_STATE_SUPPORTED) {
    return true;
  }

  return window.document.visibilityState === 'visible';
}

/**
 * Returns whether the window is currently visible to the user.
 */
export function useIsWindowVisible() {
  const [isVisible, setIsVisible] = useState(isWindowVisible());

  useEffect(() => {
    if (!VISIBILITY_STATE_SUPPORTED) return undefined;

    const handleVisibilityChange = () => {
      setIsVisible(isWindowVisible());
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setIsVisible]);

  return isVisible;
}
