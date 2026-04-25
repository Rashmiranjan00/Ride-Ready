import { useState, useEffect } from 'react';

/**
 * A hook that strictly derives elapsed duration from a given startTime.
 * It uses setInterval merely as a tick mechanism to trigger React re-renders.
 */
export function useTimer(startTime: number | null, pauseTime: number | null = null) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!startTime) {
      setDuration(0);
      return;
    }

    if (pauseTime) {
      setDuration(pauseTime - startTime);
      return;
    }

    // Immediately compute on mount/change
    setDuration(Date.now() - startTime);

    const interval = setInterval(() => {
      setDuration(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, pauseTime]);

  return duration;
}
