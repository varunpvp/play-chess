export default interface Game {
  fen: string;
  white: GamePlayer | null;
  black: GamePlayer | null;
}

export interface GamePlayer {
  id: string;
  name: string;
  online: boolean;
}
