export default interface Game {
  fen: string;
  white: GamePlayer | null;
  black: GamePlayer | null;
  clock?: GameClock; // Added for game clock
}

export type GameColor = "white" | "black";

export interface GamePlayer {
  id: string;
  name: string;
  online: boolean;
}

// Game clock interface
export interface GameClock {
  whiteTime: number; // ms
  blackTime: number; // ms
  increment: number; // ms
  totalTime: number; // ms
  lastMoveTime?: number; // timestamp
  isActive: boolean;
  activeColor?: GameColor;
}
