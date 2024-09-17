import { useEffect, useState } from "react";
import "./player.scss";
import { type Position } from "../../types";

interface Props {
	position?: Position;
	hasGold?: boolean;
}

const cell_size = 5;

const Player: React.FC<Props> = ({ position, hasGold = false }) => {
	const playerPositionStyle = {
		"--player-pos-x": position?.x,
		"--player-pos-y": position?.y,
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
