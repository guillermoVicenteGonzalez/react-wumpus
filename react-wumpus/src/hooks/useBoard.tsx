import { useState, useEffect } from "react";
import { Position, type CellType } from "../types";

function createBoard(s: number) {
	let board: Array<CellType[]> = [];
	for (let i = 0; i < s; i++) {
		let nestedBoard: CellType[] = [];
		// let nestedBoard: CellType[] = new Array(s).fill("WUMPUS");
		for (let j = 0; j < s; j++) {
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

export function useBoard(size: number) {
	const [board, setBoard] = useState<Array<CellType[]>>([]);

	function visitCell({ x, y }: Position) {
		let auxBoard = [...board];
		auxBoard[y - 1][x - 1].visited = true;
		setBoard(auxBoard);
	}

	useEffect(() => {
		let nBoard = createBoard(size);
		setBoard(nBoard);
	}, [size]);

	return { board, visitCell };
}
