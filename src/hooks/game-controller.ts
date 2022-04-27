import { useEffect, useState } from "react";
import { FirebaseAuth, FirebaseDatabase } from "../config/firebase";
import Game from "../types/game";
import { getColorToPlayFromFen, makeMove } from "../utils/chess";

const useGameController = (gameId: string) => {
  const [state, setState] = useState<Game>({
    black: null,
    white: null,
    fen: "",
  });
  const userId = FirebaseAuth.currentUser?.uid;
  const playerColor = (): string | null => {
    if (state.white && state.white.id == userId) {
      return "white";
    } else if (state.black && state.black.id == userId) {
      return "black";
    }
    return null;
  };

  const turn = getColorToPlayFromFen(state.fen);

  const updateState = (nextState: Game | null) =>
    setState({ ...state, ...nextState });

  useEffect(() => {
    const gameRef = FirebaseDatabase.ref("game").child(gameId);

    gameRef.on("value", (snapshot) => {
      if (snapshot.exists()) {
        setState(snapshot.val());
      }
    });

    return () => {
      gameRef.off();
    };
  }, []);

  return {
    state,
    makeMove(move: string) {
      const nextState = makeMove(state, move);
      updateState(nextState);
    },
  };
};

export default useGameController;
