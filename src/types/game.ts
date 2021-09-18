export default interface IGame {
  fen: string;
  w?: IPlayer;
  b?: IPlayer;
  status: GameStatus;
  result?: GameResult;
}

export interface IPlayer {
  id: string;
  name: string;
  online: boolean;
}

export enum GameStatus {
  IN_PROGRESS = "IN_PROGRESS",
  TIMEOUT = "TIMEOUT",
  CHECKMATE = "CHECKMATE",
  RESIGNATION = "RESIGNATION",
  DRAW = "DRAW",
}

export type GameResult = {
  w: number;
  b: number;
  text?: string;
};
