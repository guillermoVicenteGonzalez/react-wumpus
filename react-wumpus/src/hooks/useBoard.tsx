import { useState, useEffect } from "react";
import { Position, type CellType } from "../types";

function createObstacles(size: number): Object {
	let min = 1;

	let wumpusPos: Position = {
		x: Math.floor(Math.random() * (size - min + 1)) + min,
		y: Math.floor(Math.random() * (size - min + 1)) + min,
	};

	let wellPos: Position = {
		x: Math.floor(Math.random() * (size - min + 1)) + min,
		y: Math.floor(Math.random() * (size - min + 1)) + min,
	};

	while (wellPos.x === wumpusPos.x && wellPos.y === wumpusPos.y) {
		wellPos = {
			x: Math.floor(Math.random() * (size - min + 1)) + min,
			y: Math.floor(Math.random() * (size - min + 1)) + min,
		};
	}

	let goldPos: Position = {
		x: Math.floor(Math.random() * (size - min + 1)) + min,
		y: Math.floor(Math.random() * (size - min + 1)) + min,
	};

	while (
		(wellPos.x === goldPos.x && wellPos.y === goldPos.y) ||
		(goldPos.x === wumpusPos.x && goldPos.y === wumpusPos.y)
	) {
		goldPos = {
			x: Math.floor(Math.random() * (size - min + 1)) + min,
			y: Math.floor(Math.random() * (size - min + 1)) + min,
		};
	}

	return { wumpusPos, wellPos, goldPos };
}

function createBoard(s: number) {
	let board: Array<CellType[]> = [];
	for (let i = 0; i < s; i++) {
		let nestedBoard: CellType[] = [];
		for (let j = 0; j < s; j++) {
			nestedBoard.push({
				states: {},
				visited: false,
				position: { x: i, y: j },
			});
		}
		board.push(nestedBoard);
	}

	const obstacles = createObstacles(s);
	for (const key in obstacles) {
		console.log(key);
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
