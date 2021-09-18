import accurateInterval from "accurate-interval";
import React, { useEffect, useState } from "react";
import { Clock } from "../types/game";
import { remainingTimeFor } from "../util/game";

const PlayerClock: React.FC<{
  running: boolean;
  clock: Clock;
  side: "w" | "b";
  onTimeout: () => void;
  children?: (value: number) => React.ReactElement;
}> = ({ clock, side, onTimeout, children, running }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(remainingTimeFor(clock, side));
  }, [clock, side]);

  useEffect(() => {
    if (!running || clock.color !== side) {
      return;
    }

    const interval = accurateInterval(
      () => {
        setTime((it) => {
          const newTime = it - 1;

          if (newTime <= 0) {
            onTimeout();
            interval.clear();
            return 0;
          }

          return newTime;
        });
      },
      1000,
      {
        aligned: true,
        immediate: true,
      }
    );

    return () => {
      interval.clear();
    };
  }, [clock, side]);

  return children ? children(time) : <span>{time}</span>;
};

export default PlayerClock;
