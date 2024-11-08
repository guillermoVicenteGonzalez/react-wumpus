import { useState, useEffect } from "react";
import { Position, type CellType } from "../types";

//returns an array of cells surrounding an obstacle (they have a field position) with their appropiate states set
function surroundCells(pos: Position, limit: number) {
  const positions: Position[] = [];

  for (let i = pos.x - 1; i < pos.x + 2; i++) {
    if (i != pos.x && i < limit && i >= 0) positions.push({ x: i, y: pos.y });
  }

  for (let i = pos.y - 1; i < pos.y + 2; i++) {
    if (i != pos.y && i < limit && i >= 0) positions.push({ x: pos.x, y: i });
  }

  return positions;
}

function randomPosition(min: number, max: number) {
  return {
    x: Math.floor(Math.random() * (max - min + 1)) + min,
    y: Math.floor(Math.random() * (max - min + 1)) + min,
  } as Position;
}

export function comparePosition(pos1: Position, pos2: Position) {
  if (pos1.x === pos2.x && pos1.y === pos2.y) return true;
  return false;
}

function createObstacles(board: Array<CellType[]>, size: number) {
  const startingPos: Position = { x: 0, y: 0 };
  const nWells = size / 2.5;

  const min = 0;
  const max = size - 1;

  const obstacles: Position[] = [];
  obstacles.push(startingPos);
  board[startingPos.x][startingPos.y].states.START = true;
  board[startingPos.x][startingPos.y].visited = true;

  //first we setup the well
  for (let i = 0; i < nWells; i++) {
    let wellPos = randomPosition(min, max);
    while (obstacles.some((pos) => comparePosition(pos, wellPos))) {
      wellPos = randomPosition(min, max);
    }
    obstacles.push(wellPos);
    board[wellPos.x][wellPos.y].states.WELL = true;
    surroundCells(wellPos, size).forEach((pos) => {
      board[pos.x][pos.y].states.BREEZE = true;
    });
  }

  //now we setup the wumpus
  let wumpusPos = randomPosition(min, max);
  while (obstacles.some((pos) => comparePosition(pos, wumpusPos))) {
    wumpusPos = randomPosition(min, max);
  }
  obstacles.push(wumpusPos);
  board[wumpusPos.x][wumpusPos.y].states.WUMPUS = true;
  surroundCells(wumpusPos, size).forEach((pos) => {
    board[pos.x][pos.y].states.STENCH = true;
  });

  //lastly we setup the gold
  let goldPos = randomPosition(min, max);
  while (obstacles.some((pos) => comparePosition(pos, goldPos))) {
    goldPos = randomPosition(min, max);
  }
  //TODO clean
  obstacles.push(goldPos);
  board[goldPos.x][goldPos.y].states.GOLD = true;

  return board;
}

function createBoard(s: number) {
  const board: Array<CellType[]> = [];
  for (let i = 0; i < s; i++) {
    const nestedBoard: CellType[] = [];
    for (let j = 0; j < s; j++) {
      nestedBoard.push({
        states: {},
        visited: false,
        position: { x: i, y: j },
      });
    }
    board.push(nestedBoard);
  }

  return createObstacles(board, board.length);
}

export function useBoard(size: number = 10) {
  const [board, setBoard] = useState<Array<CellType[]>>([]);

  function visitCell({ x, y }: Position) {
    const auxBoard = [...board];
    if (x >= size || y >= size) return false;
    auxBoard[y][x].visited = true;
    setBoard(auxBoard);
  }

  function checkCell({ x, y }: Position): CellType {
    return board[y][x];
  }

  function resetBoard() {
    const nBoard = createBoard(size);
    setBoard(nBoard);
  }

  useEffect(() => {
    const nBoard = createBoard(size);
    setBoard(nBoard);
  }, [size]);

  useEffect(() => {
    //resize board?
  }, [size]);

  return { board, visitCell, checkCell, resetBoard };
}
