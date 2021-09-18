import shortid from "shortid";
import { FirebaseDatabase } from "../config/firebase";
import IGame, { Clock, GameResult, GameStatus } from "../types/game";

export const createGame = async (game: IGame) => {
  const id = shortid();
  await FirebaseDatabase.ref("game").child(id).set(game);
  return id;
};

export const nowInSeconds = () => Math.floor(Date.now() / 1000);

const toNow = (timestamp: number) => nowInSeconds() - timestamp;

export const remainingTimeFor = (clock: Clock, color: "w" | "b") => {
  const isActive = clock.color === color;
  const used = clock.elapsed[color] + (isActive ? toNow(clock.timestamp) : 0);
  return clock.config.limit - used;
};

export const newClock = (limit: number, increment: number): Clock => ({
  color: "w",
  config: { limit, increment },
  elapsed: { w: 0, b: 0 },
  timestamp: 0,
});

export const getGameResult = (
  status: GameStatus,
  winning?: "w" | "b"
): GameResult | undefined => {
  const side = winning === "w" ? "White" : "Black";
  const point = (c: "w" | "b") => (winning === c ? 1 : 0);
  switch (status) {
    case "CHECKMATE":
      return {
        w: point("w"),
        b: point("b"),
        text: `${side} wins by checkmate`,
      };
    case "RESIGNATION":
      return {
        w: point("w"),
        b: point("b"),
        text: `${side} wins by resignation`,
      };
    case "TIMEOUT":
      return {
        w: point("w"),
        b: point("b"),
        text: `${side} wins by timeout`,
      };
    case "DRAW":
      return {
        w: 0.5,
        b: 0.5,
        text: `Game draw`,
      };
    default:
      return undefined;
  }
};
