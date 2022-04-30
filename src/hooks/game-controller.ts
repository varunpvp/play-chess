import { useEffect, useState } from "react";
import { FirebaseAuth, FirebaseDatabase } from "../config/firebase";
import Game from "../types/game";
import {
  getColorToPlayFromFen,
  getOpponent,
  getPlayer,
  joinPlayer,
  makeMove,
  START_FEN,
} from "../utils/chess";

const defaultGame = {
  fen: START_FEN,
  black: null,
  white: null,
};

const useGameController = (gameId: string) => {
  const userId = FirebaseAuth.currentUser?.uid!;
  const [gameRef] = useState(FirebaseDatabase.ref("game").child(gameId));
  const [state, setState] = useState<Game>(defaultGame);

  const player = getPlayer(state, userId);
  const opponent = getOpponent(state, userId);
  const turn = getColorToPlayFromFen(state.fen);

  useEffect(() => {
    gameRef.on("value", (snapshot) => {
      if (snapshot.exists()) {
        setState(snapshot.val());
      }
    });

    return () => {
      gameRef.off();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (player) {
      const onlineRef = gameRef.child(player.color).child("online");

      onlineRef.set(true);
      onlineRef.onDisconnect().set(false);
    }
    // eslint-disable-next-line
  }, [player]);

  const updateState = (nextState: Game | null) => {
    if (!nextState) {
      return;
    }
    const newState = { ...state, ...nextState };
    setState(newState);
    gameRef.update(newState);
  };

  return {
    state,
    isLoading: !state.white && !state.black,
    player,
    opponent,
    turn,
    makeMove(move: string) {
      if (userId === player?.id && turn === player.color) {
        updateState(makeMove(state, move));
      }
    },
    joinPlayer(name: string) {
      updateState(joinPlayer(state, { id: userId, name, online: false }));
    },
  };
};

export default useGameController;
