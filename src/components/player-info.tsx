import { IPlayer } from "../types/game";

const PlayerInfo: React.FC<{
  player?: IPlayer;
  showTurnMark: boolean;
  width: number;
}> = ({ player, showTurnMark, width }) => {
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
      <span>{player?.name ?? "(waiting)"}</span>
      {showTurnMark && <span className="player-info-turn-mark">*</span>}
    </div>
  );
};

export default PlayerInfo;
