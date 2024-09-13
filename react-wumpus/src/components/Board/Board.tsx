import { useEffect, useState } from "react";
import "./board.scss";
import Player from "../player/player";
import { type Position, type CellType } from "../../types";
import Cell from "./Cell";
import { useBoard } from "../../hooks/useBoard";
import usePlayerPos from "../../hooks/usePlayerPos";

interface Props {
	size: number;
}

const startingPos: Position = { x: 1, y: 1 };

const Board: React.FC<Props> = ({ size = 10 }) => {
	// const [playerPos, setPlayerPos] = useState<Position>(startingPos);
	const { playerPos, updatePlayerPos } = usePlayerPos(startingPos, size);
	const { board, visitCell } = useBoard(size);

	useEffect(() => {
		if (board.length > 0) visitCell(startingPos);
	}, []);

	function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
		let tempPos: Position = { ...playerPos };

		if (event.code === "ArrowUp" || event.code === "w") {
			tempPos.y--;
		}

		if (event.code === "ArrowDown" || event.code === "s") {
			tempPos.y++;
		}

		if (event.code === "ArrowLeft" || event.code === "a") {
			tempPos.x--;
		}

		if (event.code === "ArrowRight" || event.code === "d") {
			tempPos.x++;
		}

		movePlayer(tempPos);
	}

	//se multiplican los indices por el tamaño de celda => posicion
	function movePlayer({ x, y }: Position) {
		visitCell(playerPos);
		console.log("setting player pos");
		let err = updatePlayerPos({ x, y });

		//check wumpus / well
		//uncover next cell
	}

	const dinamicBoardStyes = {
		"--cell-size": "5rem",
		"--board-size": size,
	} as React.CSSProperties;

	return (
		<div
			className="board"
			style={dinamicBoardStyes}
			onKeyDown={handleKeyPress}
			tabIndex={0}
		>
			<Player position={playerPos}></Player>
			{board.map((row) => {
				return row.map(({ type, visited, position }: CellType) => {
					return (
						<Cell
							type={type}
							key={position.x + position.y}
							position={position}
							visited={visited}
						></Cell>
					);
				});
			})}

			<footer>
				<h1>Debug</h1>
				<h2>
					Player pos x: {playerPos.x} y: {playerPos.y}
				</h2>
			</footer>
		</div>
	);
};

export default Board;
