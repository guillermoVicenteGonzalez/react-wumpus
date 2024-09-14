import { useEffect, useState } from "react";
import "./player.scss";
import { type Position } from "../../types";

interface Props {
	position?: Position;
}

const cell_size = 5;

const Player: React.FC<Props> = ({ position }) => {
	const playerPositionStyle = {
		"--player-pos-x": position?.x,
		"--player-pos-y": position?.y,
	} as React.CSSProperties;

	return <div className="player" style={playerPositionStyle}></div>;
};

export default Player;
