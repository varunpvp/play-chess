import React from "react";
import Chessboard from "chessboardjsx";
import { useParams } from "react-router-dom";
import GameJoin from "../components/game-join";
import ReactResizeDetector from "react-resize-detector";
import PlayerInfo from "../components/player-info";
import GameInvite from "../components/game-invite";
import Loader from "../components/loader";
import useGameController from "../hooks/game-controller";

interface Props {
  width: number;
  height: number;
}

const GamePlay: React.FC<Props> = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { state, isLoading, player, opponent, turn, joinPlayer, makeMove } =
    useGameController(gameId);

  if (isLoading) {
    return <Loader />;
  }

  if (!player) {
    return <GameJoin onJoin={(name) => joinPlayer(name)} />;
  }

  if (!opponent) {
    return <GameInvite />;
  }

  return (
    <ReactResizeDetector handleWidth handleHeight>
      {({ width, height }) => {
        const size = Math.min(width ?? 400, height ?? 400) - 120;

        return (
          <div className="game-play">
            <PlayerInfo
              player={opponent}
              width={size}
              showTurnMark={turn === opponent.color}
            />

            <Chessboard
              boardStyle={{ margin: "auto" }}
              orientation={player.color}
              width={size}
              position={state.fen}
              onDrop={(move) =>
                makeMove(`${move.sourceSquare}${move.targetSquare}`)
              }
            />

            <PlayerInfo
              player={player}
              width={size}
              showTurnMark={turn === player.color}
            />
          </div>
        );
      }}
    </ReactResizeDetector>
  );
};

export default GamePlay;
