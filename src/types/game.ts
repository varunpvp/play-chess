export default interface IGame {
  fen: string;
  white?: IPlayer;
  black?: IPlayer;
}

export interface IPlayer {
  id: string;
  name: string;
  online: boolean;
}
