import React from "react";
import { GameClock, GameColor } from "../types/game";

interface GameClockProps {
  clock: GameClock;
  color: GameColor;
  isActive: boolean;
  width: number;
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const GameClockComponent: React.FC<GameClockProps> = ({
  clock,
  color,
  isActive,
  width,
}) => {
  const time = color === "white" ? clock.whiteTime : clock.blackTime;
  return (
    <div
      className={`game-clock ${isActive ? "active" : ""}`}
      style={{
        width,
        textAlign: "center",
        fontWeight: isActive ? "bold" : "normal",
        fontSize: 24,
      }}
    >
      {formatTime(time)}
    </div>
  );
};

export default GameClockComponent;
