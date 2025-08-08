import { useEffect, useState } from "react";
import { FirebaseAuth, FirebaseDatabase } from "../config/firebase";
import Game, { GameClock, GameColor } from "../types/game";
import {
  getColorToPlayFromFen,
  getOpponent,
  getPlayer,
  joinPlayer,
  makeMove,
  START_FEN,
} from "../utils/chess";
import useGameClock from "./use-game-clock";

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

  // --- Game Clock Logic ---
  // Start clock when both players joined and clock exists but not active
  useEffect(() => {
    if (
      state.clock &&
      state.white &&
      state.black &&
      !state.clock.isActive
    ) {
      // Start the clock for the player to move
      const updatedClock: GameClock = {
        ...state.clock,
        isActive: true,
        activeColor: turn,
        lastMoveTime: Date.now(),
      };
      gameRef.update({ clock: updatedClock });
    }
    // eslint-disable-next-line
  }, [state.white, state.black, state.clock]);

  // Use game clock hook for ticking
  useGameClock({
    clock: state.clock,
    turn,
    onTimeUpdate: (updatedClock) => {
      // Only update if active
      if (updatedClock.isActive) {
        gameRef.child("clock").update(updatedClock);
      }
    },
    onTimeExpired: (color: GameColor) => {
      // End game logic can be handled here
      // For now, just stop the clock
      if (state.clock) {
        gameRef.child("clock").update({ ...state.clock, isActive: false });
      }
    },
  });

  const updateState = (nextState: Game | null) => {
    if (!nextState) {
      return;
    }
    const newState = { ...state, ...nextState };
    setState(newState);
    gameRef.update(newState);
  };

  // Update clock on move
  const makeMoveWithClock = (move: string) => {
    if (userId === player?.id && turn === player.color) {
      const next = makeMove(state, move);
      if (next && state.clock) {
        // Switch active color, add increment to previous player
        const now = Date.now();
        const prevColor = turn;
        const nextColor = prevColor === "white" ? "black" : "white";
        const increment = state.clock.increment || 0;
        const updatedClock: GameClock = {
          ...state.clock,
          isActive: true,
          activeColor: nextColor,
          lastMoveTime: now,
          whiteTime:
            prevColor === "white"
              ? Math.max(0, state.clock.whiteTime + increment - (now - (state.clock.lastMoveTime || now)))
              : state.clock.whiteTime,
          blackTime:
            prevColor === "black"
              ? Math.max(0, state.clock.blackTime + increment - (now - (state.clock.lastMoveTime || now)))
              : state.clock.blackTime,
        };
        updateState({ ...next, clock: updatedClock });
      } else if (next) {
        updateState(next);
      }
    }
  };

  return {
    state,
    isLoading: !state.white && !state.black,
    player,
    opponent,
    turn,
    makeMove: makeMoveWithClock,
    joinPlayer(name: string) {
      updateState(joinPlayer(state, { id: userId, name, online: false }));
    },
  };
};

export default useGameController;
