import { useEffect, useRef, useState } from "react";
import { GameClock, GameColor } from "../types/game";

interface UseGameClockProps {
  clock: GameClock | undefined;
  turn: GameColor;
  onTimeUpdate: (updatedClock: GameClock) => void;
  onTimeExpired: (color: GameColor) => void;
}

const useGameClock = ({
  clock,
  turn,
  onTimeUpdate,
  onTimeExpired,
}: UseGameClockProps) => {
  const [localClock, setLocalClock] = useState<GameClock | undefined>(clock);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalClock(clock);
  }, [clock]);

  useEffect(() => {
    if (!localClock || !localClock.isActive || !localClock.activeColor) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setLocalClock((prev) => {
        if (!prev) return prev;
        const now = Date.now();
        const elapsed = prev.lastMoveTime ? now - prev.lastMoveTime : 0;
        let whiteTime = prev.whiteTime;
        let blackTime = prev.blackTime;
        if (prev.activeColor === "white") {
          whiteTime = Math.max(0, prev.whiteTime - elapsed);
        } else {
          blackTime = Math.max(0, prev.blackTime - elapsed);
        }
        if (whiteTime === 0) {
          onTimeExpired("white");
        }
        if (blackTime === 0) {
          onTimeExpired("black");
        }
        const updated = {
          ...prev,
          whiteTime,
          blackTime,
          lastMoveTime: now,
        };
        onTimeUpdate(updated);
        return updated;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line
  }, [localClock?.isActive, localClock?.activeColor]);

  return localClock;
};

export default useGameClock;
