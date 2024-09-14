import { useState, useEffect } from "react";
import { type CELL_STATES, Position, type CellType } from "../types";

//returns an array of cells surrounding an obstacle (they have a field position) with their appropiate states set
function surroundCells(pos: Position, limit: number) {
	let positions: Position[] = [];

	for (let i = pos.x - 1; i < pos.x + 2; i++) {
		if (i != pos.x && i < limit && i >= 0) positions.push({ x: i, y: pos.y });
	}

	for (let i = pos.y - 1; i < pos.y + 2; i++) {
		if (i != pos.y && i < limit && i >= 0) positions.push({ x: pos.x, y: i });
	}

	return positions;
}

function createObstacles(board: Array<CellType[]>, size: number) {
	let min = 0;
	let max = 9;

	let wumpusPos: Position = {
		x: Math.floor(Math.random() * (max - min + 1)) + min,
		y: Math.floor(Math.random() * (max - min + 1)) + min,
	};

	let wellPos: Position = {
		x: Math.floor(Math.random() * (max - min + 1)) + min,
		y: Math.floor(Math.random() * (max - min + 1)) + min,
	};

	while (wellPos.x === wumpusPos.x && wellPos.y === wumpusPos.y) {
		wellPos = {
			x: Math.floor(Math.random() * (max - min + 1)) + min,
			y: Math.floor(Math.random() * (max - min + 1)) + min,
		};
	}

	let goldPos: Position = {
		x: Math.floor(Math.random() * (max - min + 1)) + min,
		y: Math.floor(Math.random() * (max - min + 1)) + min,
	};

	while (
		(wellPos.x === goldPos.x && wellPos.y === goldPos.y) ||
		(goldPos.x === wumpusPos.x && goldPos.y === wumpusPos.y)
	) {
		goldPos = {
			x: Math.floor(Math.random() * (max - min + 1)) + min,
			y: Math.floor(Math.random() * (max - min + 1)) + min,
		};
	}

	board[goldPos.x][goldPos.y].states.GOLD = true;
	board[wellPos.x][wellPos.y].states.WELL = true;
	board[wumpusPos.x][wumpusPos.y].states.WUMPUS = true;

	surroundCells(wumpusPos, size).forEach((pos) => {
		board[pos.x][pos.y].states.STENCH = true;
	});

	surroundCells(wellPos, size).forEach((pos) => {
		board[pos.x][pos.y].states.BREEZE = true;
	});

	return board;
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

	return createObstacles(board, s);
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
