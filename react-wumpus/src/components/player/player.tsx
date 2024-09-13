import { useEffect, useState } from "react";
import "./player.scss";

export type Position = {
	x: number;
	y: number;
};

type AbsolutePosition = {
	x: string;
	y: string;
};

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
