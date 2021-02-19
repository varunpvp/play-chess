import { ChessInstance, ShortMove } from "chess.js";
import { FirebaseAuth, FirebaseDatabase } from "../config/firebase";
import IGame, { IPlayer } from "../types/game";

const Chess = require("chess.js");

export default class Game implements IGame {
  fen: string;
  white?: IPlayer | undefined;
  black?: IPlayer | undefined;

  private chess: ChessInstance;
  private ref: firebase.default.database.Reference;

  private constructor(id: string, game: IGame) {
    this.fen = game.fen;
    this.white = game.white;
    this.black = game.black;

    this.chess = new Chess(game.fen);
    this.ref = FirebaseDatabase.ref("game").child(id);
  }

  static from(id: string, game: IGame) {
    return new Game(id, game);
  }

  get isOver() {
    return this.chess.game_over();
  }

  get isDraw() {
    return this.chess.in_draw();
  }

  get isCheckmate() {
    return this.chess.in_checkmate();
  }

  get turn() {
    return this.chess.turn() === "w" ? "white" : "black";
  }

  get player() {
    if (this.playerColor) {
      return this[this.playerColor];
    }
    return undefined;
  }

  get opponent() {
    if (this.opponentColor) {
      return this[this.opponentColor];
    }
    return undefined;
  }

  get opponentColor() {
    if (this.playerColor) {
      return this.playerColor === "white" ? "black" : "white";
    }
    return undefined;
  }

  get playerColor() {
    if (this.black?.id === this.userId) {
      return "black";
    } else if (this.white?.id === this.userId) {
      return "white";
    }
    return undefined;
  }

  private get awaitingPlayerColor() {
    if (!this.white) {
      return "white";
    } else if (!this.black) {
      return "black";
    }
    return undefined;
  }

  private get userId() {
    return FirebaseAuth.currentUser?.uid;
  }

  joinPlayer(name: string) {
    if (this.awaitingPlayerColor) {
      this.ref
        .child(this.awaitingPlayerColor)
        .set({ id: this.userId, name, online: true });
    }
  }

  makeMove(move: ShortMove) {
    if (this.playerColor === this.turn && this.chess.move(move)) {
      this.ref.child("fen").set(this.chess.fen());
    }
  }
}
