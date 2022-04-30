import Game, { GameColor, GamePlayer } from "../types/game";
const Chess = require("chess.js");

export const makeMove = (game: Game, move: string): Game | null => {
  const chess = new Chess(game.fen);
  const chessMove = chess.move(move, { sloppy: true });

  if (!chessMove) {
    return null;
  }

  return {
    ...game,
    fen: chess.fen(),
  };
};

export const getColorToPlayFromFen = (fen: string): GameColor => {
  return fen.split(" ")[1] === "w" ? "white" : "black";
};

export const getPlayer = (
  game: Game,
  userId: string
): (GamePlayer & { color: GameColor }) | null => {
  if (game.white && game.white.id === userId) {
    return { ...game.white, color: "white" };
  } else if (game.black && game.black.id === userId) {
    return { ...game.black, color: "black" };
  }

  return null;
};

export const getOpponent = (
  game: Game,
  userId: string
): (GamePlayer & { color: GameColor }) | null => {
  if (game.white && game.white.id !== userId) {
    return { ...game.white, color: "white" };
  } else if (game.black && game.black.id !== userId) {
    return { ...game.black, color: "black" };
  }

  return null;
};

export const joinPlayer = (game: Game, player: GamePlayer): Game | null => {
  if (game.white && game.black) {
    return null;
  }

  if (!game.white) {
    return {
      ...game,
      white: player,
    };
  } else {
    return {
      ...game,
      black: player,
    };
  }
};
