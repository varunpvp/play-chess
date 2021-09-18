import { Button, Popconfirm } from "antd";
import Game from "../models/game";

const PlayerInfo: React.FC<{
  color?: "w" | "b";
  width: number;
  game: Game;
}> = ({ game, color, width }) => {
  const player = color ? game[color] : undefined;
  const showTurnMark = game.turn === color;
  const showControls = game.userId === player?.id;

  const buttons = [
    {
      render: (
        <Button type="primary" shape="round">
          Draw
        </Button>
      ),
      when: game.inProgress,
    },
    {
      render: (
        <Popconfirm
          title="Are you sure to resign the game?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => game.resign()}
        >
          <Button danger type="primary" shape="round">
            Resign
          </Button>
        </Popconfirm>
      ),
      when: game.inProgress,
    },
    {
      render: (
        <Button type="primary" shape="round">
          Rematch
        </Button>
      ),
      when: game.isOver,
    },
  ].filter((it) => it.when);

  return (
    <div
      className="player-info"
      style={{
        width,
      }}
    >
      <span
        className="player-info-status"
        style={{
          backgroundColor: player?.online ? "green" : "grey",
        }}
      ></span>
      <span>{`${player?.name} ${showTurnMark ? "*" : ""}` ?? "(waiting)"}</span>
      {showControls && (
        <div className="flex-1 flex justify-end">
          <Button.Group>{buttons.map((it) => it.render)}</Button.Group>
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;
