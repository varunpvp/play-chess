import React, { useEffect, useState } from "react";
import Chessboard from "chessboardjsx";
import { FirebaseDatabase } from "../config/firebase";
import { useHistory, useParams } from "react-router-dom";
import Game from "../models/game";
import GameJoin from "../components/game-join";
import ReactResizeDetector from "react-resize-detector";
import PlayerInfo from "../components/player-info";
import GameInvite from "../components/game-invite";
import Loader from "../components/loader";
import { Button } from "antd";

interface Props {
  width: number;
  height: number;
}

const GamePlay: React.FC<Props> = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const history = useHistory();

  useEffect(() => {
    const gameRef = FirebaseDatabase.ref("game").child(gameId);

    gameRef.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const newGame = Game.from(gameId, snapshot.val());

        if (newGame.rematchId) {
          history.push(`/${newGame.rematchId}`);
        } else if (newGame.playerColor) {
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

  const buttons = [
    {
      render: (
        <Button
          size="small"
          onClick={async () => {
            const id = await game.rematch();
            history.push(`/${id}`);
          }}
        >
          Yes
        </Button>
      ),
      when: game.opponentRematched,
    },
    {
      render: (
        <Button size="small" onClick={() => game.clearRematch()}>
          No
        </Button>
      ),
      when: game.opponentRematched,
    },
    {
      render: (
        <Button size="small" onClick={() => game.clearRematch()}>
          Cancel
        </Button>
      ),
      when: game.rematched,
    },
    /* Draw */
    {
      render: (
        <Button size="small" onClick={() => game.draw()}>
          Accept
        </Button>
      ),
      when: game.opponentOfferedDraw,
    },
    {
      render: (
        <Button size="small" onClick={() => game.clearDraw()}>
          Reject
        </Button>
      ),
      when: game.opponentOfferedDraw,
    },
    {
      render: (
        <Button size="small" onClick={() => game.clearDraw()}>
          Cancel
        </Button>
      ),
      when: game.offeredDraw,
    },
  ].filter((it) => it.when);

  return (
    <ReactResizeDetector handleWidth handleHeight>
      {({ width, height }) => {
        const size = Math.min(width ?? 400, height ?? 400) - 140;

        return (
          <div className="game-play">
            <div
              style={{
                height: 20,
                textAlign: "center",
                fontSize: 20,
                padding: 8,
              }}
            >
              {game.statusText}
              &nbsp;&nbsp;
              <Button.Group>{buttons.map((it) => it.render)}</Button.Group>
            </div>

            <PlayerInfo color={game.opponentColor} width={size} game={game} />

            <Chessboard
              boardStyle={{ margin: "auto" }}
              orientation={game.playerColor === "w" ? "white" : "black"}
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

            <PlayerInfo color={game.playerColor} width={size} game={game} />
          </div>
        );
      }}
    </ReactResizeDetector>
  );
};

export default (props: Props) => {
  const params = useParams<{ gameId: string }>();
  return <GamePlay key={params.gameId} {...props} />;
};
