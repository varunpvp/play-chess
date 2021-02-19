import React, { useEffect, useState } from "react";
import Chessboard from "chessboardjsx";
import { FirebaseDatabase } from "../config/firebase";
import { useParams } from "react-router-dom";
import Game from "../models/game";
import GameJoin from "../components/game-join";
import ReactResizeDetector from "react-resize-detector";
import PlayerInfo from "../components/player-info";
import GameInvite from "../components/game-invite";
import Loader from "../components/loader";

interface Props {
  width: number;
  height: number;
}

const GamePlay: React.FC<Props> = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const gameRef = FirebaseDatabase.ref("game").child(gameId);

    gameRef.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const newGame = Game.from(gameId, snapshot.val());

        if (newGame.playerColor) {
          const onlineRef = gameRef.ref
            .child(newGame.playerColor)
            .child("online");

          onlineRef.set(true);

          onlineRef.onDisconnect().set(false);
        }

        setGame(newGame);
      }
    });

    return () => {
      gameRef.off();
    };
    // eslint-disable-next-line
  }, []);

  if (!game) {
    return <Loader />;
  }

  if (!game.player) {
    return <GameJoin onJoin={(name) => game.joinPlayer(name)} />;
  }

  if (!game.opponent) {
    return <GameInvite />;
  }

  return (
    <ReactResizeDetector handleWidth handleHeight>
      {({ width, height }) => {
        const size = Math.min(width ?? 400, height ?? 400) - 120;

        return (
          <div className="game-play">
            <PlayerInfo
              player={game.opponent}
              width={size}
              showTurnMark={game.turn === game.opponentColor}
            />

            <Chessboard
              boardStyle={{ margin: "auto" }}
              orientation={game.playerColor}
              width={size}
              position={game.fen}
              onDrop={(move) => {
                game.makeMove({
                  from: move.sourceSquare,
                  to: move.targetSquare,
                  promotion: "q",
                });
              }}
            />

            <PlayerInfo
              player={game.player}
              width={size}
              showTurnMark={game.turn === game.playerColor}
            />
          </div>
        );
      }}
    </ReactResizeDetector>
  );
};

export default GamePlay;
