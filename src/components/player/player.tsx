import { type Position } from "../../types";

interface Props {
  position: Position;
  hasGold?: boolean;
}

const Player: React.FC<Props> = ({ position, hasGold = false }) => {
  const playerPositionStyle = {
    "--player-pos-x": position.x + 1,
    "--player-pos-y": position.y + 1,
  } as React.CSSProperties;

  const playerWithGold = hasGold ? "player--gold" : "";

  return (
    <div
      className={`player ${playerWithGold}`}
      style={playerPositionStyle}
    ></div>
  );
};

export default Player;
