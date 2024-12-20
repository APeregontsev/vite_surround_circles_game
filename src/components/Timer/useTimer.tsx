import React from "react";

const TICK_INTERVAL = 1000;

export function useTimer(isTimerActive: boolean) {
  // Time in seconds
  const [time, setTime] = React.useState(0);
  const intervalRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (isTimerActive) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTime((prev) => prev + 1);
        }, TICK_INTERVAL);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isTimerActive]);

  const resetTimer = React.useCallback(() => {
    setTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (isTimerActive) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, TICK_INTERVAL);
    }
  }, [isTimerActive]);

  // Helper function to format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return { timer: formatTime(time), resetTimer };
}
