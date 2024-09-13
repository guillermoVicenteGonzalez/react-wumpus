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
	const [absolutePosition, setAbsoultePosition] = useState<AbsolutePosition>({
		x: "0rem",
		y: "0rem",
	});
	useEffect(() => {
		setAbsoultePosition(transformToAbsolutePosition(position));
	}, [position]);

	function transformToAbsolutePosition(pos: Position): AbsolutePosition {
		let x = cell_size * pos.x;
		let y = cell_size * pos.y;

		return { x: x + "rem", y: y + "rem" };
	}

	console.log(absolutePosition);

	const playerPositionStyle = {
		"--player-pos-x": absolutePosition?.x,
		"--player-pos-y": absolutePosition?.y,
	} as React.CSSProperties;

	return <div className="player" style={playerPositionStyle}></div>;
};

export default Player;
