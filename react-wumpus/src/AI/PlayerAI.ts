/*
// Planteamiento inverso: Todas aparecen como unexplored + insecure.
Explorar una casilla y ver que no es insecure implica hacer safe las que hay alrededor.
Una casilla safe siempre es safe, no se cambia nunca.
Encontrarse stench / breeze => marcar como danger las adyacentes QUE NO SEAN SAFE.
Encontrarse STENCH  => implica tambien marcar esa casilla como safe.
Hay que almacenar las RUTAS ya visitadas? para evitar loops. 
*/

import { CellType, Position } from "../types";

type internalCell = {
  explored: boolean;
  state?: "dangerous" | "unsafe" | "safe";
};

export default class AIPlayer {
  #board: CellType[][];
  #internalBoard: internalCell[][];
  #size: number;
  #startingPos: Position = { x: 0, y: 0 };

  constructor(size: number, board: CellType[][], startPos?: Position) {
    this.#size = size;
    this.#board = board;
    this.#internalBoard = this.#generateInternalBoard(this.#size);
    if (startPos != null) this.#startingPos = startPos;
  }

  getBoard() {
    return this.#board;
  }

  setBoard(nBoard: CellType[][]) {
    this.#board = nBoard;
  }

  resetInternalBoard() {
    "regenerating internal board";
    this.#internalBoard = this.#generateInternalBoard(this.#size);
  }

  //uses current board
  //doesnt work
  updateInternalBoard() {
    const visitedCells = this.#board
      .map((row) => {
        return row.filter((cell) => cell.visited);
      })
      .flat();

    let tempBoard = [...this.#internalBoard];
    //we set each visited cell to explored

    for (let i = 0; i < visitedCells.length; i++) {
      const { x, y } = visitedCells[i].position;
      tempBoard[x][y].explored = true;
      tempBoard = this.#updateInternalState({ x, y }, tempBoard);
    }

    this.#internalBoard = [...tempBoard];
  }

  regenerateInternalBoard() {
    const visitedCells = this.#board
      .map((row) => {
        return row.filter((cell) => cell.visited);
      })
      .flat();

    //i reset the board
    this.#internalBoard = this.#generateInternalBoard(this.#size);

    //we set each visited cell to explored
    for (let i = 0; i < visitedCells.length; i++) {
      const { x, y } = visitedCells[i].position;
      //this is a mess
      this.#internalBoard[x][y].explored = true;
      this.#internalBoard = this.#updateInternalState(
        { x, y },
        this.#internalBoard
      );
    }
  }

  setSize(nSize: number) {
    this.#size = nSize;
    this.resetInternalBoard();
  }

  //this is done this way because array.fill() uses the same reference for every element
  /**
	 * 		this.#internalBoard = new Array(size).fill(
			new Array(size).fill({ explored: false })
		); 
	 */
  #generateInternalBoard(size: number) {
    const arr: internalCell[][] = [];
    for (let i = 0; i < size; i++) {
      const auxArr: internalCell[] = [];
      for (let j = 0; j < size; j++) {
        auxArr.push({ explored: false });
      }
      arr.push(auxArr);
    }

    return arr;
  }

  #getNeighbours(pos: Position, size: number) {
    const cells: Position[] = [];

    for (let i = -1; i <= 2; i += 2) {
      for (const key in pos) {
        const auxPos = { ...pos };
        auxPos[key as keyof Position] += i;
        if (
          auxPos[key as keyof Position] < size &&
          auxPos[key as keyof Position] >= 0
        ) {
          cells.push(auxPos);
        }
      }
    }

    return cells;
  }

  getPath(startingPos: Position) {
    const pathToGold = this.#explore(startingPos, 0);
    if (!pathToGold) return null;
    console.log(this.#internalBoard);
    const goldPos = pathToGold[pathToGold.length - 1];
    const backPath = this.#calculateBackPath(goldPos);
    let res = [];
    if (backPath != null) {
      res = [...pathToGold, ...backPath];
    } else {
      res = [...pathToGold, ...pathToGold.reverse()];
    }

    console.log("result");
    console.log(res);
    return res;
  }

  #updateInternalState(currentPos: Position, internalBoard: internalCell[][]) {
    const { x, y } = currentPos;
    const neighbours = this.#getNeighbours(currentPos, this.#size);
    const nextStateBoard = [...internalBoard];

    //if there is danger => surrounding non visisted cells become dangerous
    //if a cell was deemed safe before, its state is not touched
    if (this.#board[x][y].states.STENCH || this.#board[x][y].states.BREEZE) {
      neighbours.forEach((n) => {
        if (
          !nextStateBoard[n.x][n.y].explored &&
          nextStateBoard[n.x][n.y].state == "safe"
        )
          nextStateBoard[n.x][n.y].state = "unsafe";
      });
    } else {
      neighbours.forEach((n) => {
        if (!nextStateBoard[n.x][n.y].explored)
          nextStateBoard[n.x][n.y].state = "safe";
      });
    }

    return nextStateBoard;
  }

  //There should be another heuristic: "prioritize advancing on one axis"
  #orderNeighbours(neighbours: Position[], internalBoard: internalCell[][]) {
    let localNeighbours = [...neighbours];

    localNeighbours = localNeighbours.filter(({ x, y }) => {
      return internalBoard[x][y].explored == false;
    });

    localNeighbours = localNeighbours.sort((n1) => {
      if (internalBoard[n1.x][n1.y].state == "unsafe") return -1;
      return 1;
    });

    return localNeighbours;
  }

  #explore(currentPos: Position, currentDepth: number = 0): Position[] | null {
    const { x, y } = currentPos;

    //if the depth is greater than the space of possibilities (the size) => return
    if (currentDepth >= this.#size * this.#size) {
      return null;
    }

    //I explore the cell and mark it as such
    this.#internalBoard[x][y].explored = true;

    //If it is the gold => return
    if (this.#board[x][y].states.GOLD) {
      return [currentPos];
    }

    //I check that it isn't the WELL or the WUMPUS
    if (this.#board[x][y].states.WELL || this.#board[x][y].states.WUMPUS) {
      return null;
    }

    //if it aint either of them => safe cell
    this.#internalBoard[x][y].state = "safe";

    //if not i get the neighbours
    let neighbours = this.#getNeighbours({ x, y }, this.#size);

    //If stench or breeze i set surrounding unexplored cells to dangerous
    //If normal cell => surrounding are also safe
    this.#internalBoard = this.#updateInternalState(
      currentPos,
      this.#internalBoard
    );

    //now we order the neighbours and explore the optimal one
    neighbours = this.#orderNeighbours(neighbours, this.#internalBoard);
    if (neighbours.length == 0) {
      return null;
    }

    //we define the situation
    //if i use foreach, every call is done "at the same time"
    for (let i = 0; i < neighbours.length; i++) {
      const res: Array<Position> | null = this.#explore(
        neighbours[i],
        currentDepth + 1
      );
      if (res != null) {
        return [currentPos, ...res];
      }
    }

    return null;
  }

  #calculateBackPath(
    pos: Position,
    explored: Position[] = [],
    currentDepth: number = 0
  ): Position[] | null {
    if (currentDepth >= 60) return null;
    console.log("\nIteration nº " + currentDepth + " --------------");
    console.log("pos : " + pos.x + " " + pos.y);

    //i get the neighbours and filter only the explored ones
    if (pos.x == this.#startingPos.x && pos.y == this.#startingPos.y) {
      console.log("I arrived at my destination");
      return [pos];
    }

    let neighbours = this.#getNeighbours(pos, this.#size);
    console.log("unfiltered neighbours");
    console.log(neighbours);
    neighbours = neighbours.filter(({ x, y }) => {
      if (this.#internalBoard[x][y].explored) return { x, y };
    });

    console.log("explored neighbours");
    console.log(neighbours);

    //now i order them by distance to starting pos
    neighbours.sort((n1, n2) => {
      if (
        this.#calculateDistance(n1, this.#startingPos) >
        this.#calculateDistance(n2, this.#startingPos)
      )
        return 1;
      else return -1;
    });

    console.log("Sorted neighbours");
    console.log(neighbours);
    console.log("Next position");
    console.log(neighbours[0]);

    const res = this.#calculateBackPath(
      neighbours[0],
      [pos, ...explored],
      currentDepth + 1
    );

    if (res == null) return null;

    return [pos, ...res];
  }

  #calculateDistance(origin: Position, destination: Position) {
    const xDist = Math.abs(destination.x - origin.x);
    const yDist = Math.abs(destination.y - origin.y);
    return xDist + yDist;
  }
}
