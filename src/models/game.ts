import { ChessInstance, ShortMove } from "chess.js";
import { FirebaseAuth, FirebaseDatabase } from "../config/firebase";
import IGame, { GameResult, GameStatus, IPlayer } from "../types/game";
import { getGameResult } from "../util/game";

const Chess = require("chess.js");

export default class Game implements IGame {
  fen: string;
  w?: IPlayer | undefined;
  b?: IPlayer | undefined;
  status: GameStatus;
  result?: GameResult;

  private chess: ChessInstance;
  private ref: firebase.default.database.Reference;

  private constructor(id: string, game: IGame) {
    this.fen = game.fen;
    this.w = game.w;
    this.b = game.b;
    this.status = game.status;
    this.result = game.result;

    this.chess = new Chess(game.fen);
    this.ref = FirebaseDatabase.ref("game").child(id);
  }

  static from(id: string, game: IGame) {
    return new Game(id, game);
  }

  get inProgress() {
    return this.status === GameStatus.IN_PROGRESS;
  }

  get isOver() {
    return !this.inProgress;
  }

  get turn() {
    return this.chess.turn();
  }

  get player() {
    return this.playerColor ? this[this.playerColor] : undefined;
  }

  get opponent() {
    return this.opponentColor ? this[this.opponentColor] : undefined;
  }

  get opponentColor() {
    return this.playerColor === "w" ? "b" : "w";
  }

  get playerColor() {
    if (this.b?.id === this.userId) {
      return "b";
    } else if (this.w?.id === this.userId) {
      return "w";
    }
    return undefined;
  }

  private get awaitingPlayerColor() {
    if (!this.w) {
      return "w";
    } else if (!this.b) {
      return "b";
    }
    return undefined;
  }

  get userId() {
    return FirebaseAuth.currentUser?.uid;
  }

  get statusText() {
    return this.result ? this.result.text : "Game in progress";
  }

  joinPlayer(name: string) {
    if (this.awaitingPlayerColor) {
      this.ref
        .child(this.awaitingPlayerColor)
        .set({ id: this.userId, name, online: true });
    }
  }

  makeMove(move: ShortMove) {
    if (
      this.inProgress &&
      this.playerColor === this.turn &&
      this.chess.move(move)
    ) {
      this.ref.child("fen").set(this.chess.fen());
    }
  }

  resign() {
    if (this.opponentColor) {
      this.ref.update({
        status: GameStatus.RESIGNATION,
        result: getGameResult(GameStatus.RESIGNATION, this.opponentColor),
      });
    }
  }
}
