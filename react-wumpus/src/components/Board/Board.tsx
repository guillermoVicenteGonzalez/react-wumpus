import { type CellType } from "../../constants";
import { useEffect, useState } from "react";
import "./board.scss";
import Player from "../player/player";
import { type Position } from "../player/player";

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

	//se multiplican los indices por el tamaño de celda => posicion
	function handlePlayerMove(x: number, y: number) {}

	function createBoard(s: number) {
		let board: Array<CellType[]> = [];
		for (let i = 0; i < s; i++) {
			let nestedBoard: CellType[] = [];
			// let nestedBoard: CellType[] = new Array(s).fill("WUMPUS");
			for (let j = 0; j < size; j++) {
				nestedBoard.push("WUMPUS");
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
		<div className="board" style={dinamicBoardStyes}>
			<Player position={playerPos}></Player>
			{board.map((row, index) => {
				return row.map((cell, i) => {
					return <div key={i} className="board__cell"></div>;
				});
			})}
		</div>
	);
};

export default Board;
