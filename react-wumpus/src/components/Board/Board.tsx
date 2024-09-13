import { useEffect, useState } from "react";
import "./board.scss";
import Player from "../player/player";
import { type Position, type CellType } from "../../types";
import Cell from "./Cell";

interface Props {
	size: number;
}

const Board: React.FC<Props> = ({ size = 10 }) => {
	const [board, setBoard] = useState<Array<CellType[]>>([]);
	const [playerPos, setPlayerPos] = useState<Position>({ x: 5, y: 5 });

	useEffect(() => {
		let nBoard = createBoard(size);
		console.log(nBoard);
		setBoard(nBoard);
	}, [size]);

	function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
		let tempPos: Position = playerPos;

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
		//check out of bounds
		//check wumpus / well
		//uncover next cell
		setPlayerPos({ x, y });
	}

	function createBoard(s: number) {
		let board: Array<CellType[]> = [];
		for (let i = 0; i < s; i++) {
			let nestedBoard: CellType[] = [];
			// let nestedBoard: CellType[] = new Array(s).fill("WUMPUS");
			for (let j = 0; j < size; j++) {
				nestedBoard.push({
					type: "WUMPUS",
					visited: false,
					position: { x: i, y: j },
				});
			}
			board.push(nestedBoard);
		}
		return board;
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
							key={position.toString()}
							position={position}
							visited={visited}
						></Cell>
					);
				});
			})}
		</div>
	);
};

export default Board;
