import { GameResult, GameStatus } from "../types/game";

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
