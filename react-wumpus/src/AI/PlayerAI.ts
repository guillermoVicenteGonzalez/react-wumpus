/*
// Planteamiento inverso: Todas aparecen como unexplored + insecure.
Explorar una casilla y ver que no es insecure implica hacer safe las que hay alrededor.
Una casilla safe siempre es safe, no se cambia nunca.
Encontrarse stench / breeze => marcar como danger las adyacentes QUE NO SEAN SAFE.
Encontrarse STENCH  => implica tambien marcar esa casilla como safe.
Hay que almacenar las RUTAS ya visitadas? para evitar loops. 
*/

import { CellStates, CellType, Position } from "../types";

type internalCell = {
  explored: boolean;
  state?: "dangerous" | "unsafe" | "safe";
};

// let board: CellType[][];
// let internalBoard: internalCell[][];
// let size: number;

export default class AIPlayer {
  #board: CellType[][];
  #internalBoard: internalCell[][];
  #size: number;

  constructor(size: number, board: CellType[][]) {
    this.#size = size;
    this.#board = board;
    this.#internalBoard = this.#generateInternalBoard(this.#size);
  }

  setBoard(nBoard: CellType[][]) {
    this.#board = nBoard;
  }

  resetInternalBoard() {
    this.#internalBoard = this.#generateInternalBoard(this.#size);
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

  #orderNeighbours(neighbours: Position[], internalBoard: internalCell[][]) {
    let localNeighbours = [...neighbours];

    //primero filtro las posiciones seguras.
    localNeighbours = localNeighbours
      // .filter(({ x, y }) => {
      // 	return internalBoard[x][y].state != "insecure";
      // })
      .filter(({ x, y }) => {
        return internalBoard[x][y].explored == false;
      });

    //luego ordeno en funcion de si están explorados o no.
    localNeighbours = localNeighbours.sort((n1, _n2) => {
      if (internalBoard[n1.x][n1.y].state == "unsafe") return -1;
      return 1;
    });

    return localNeighbours;
  }

  explore(currentPos: Position, currentDepth: number = 0, action?: () => void) {
    const { x, y } = currentPos;

    //if the depth is greater than the space of possibilities (the size) => return
    if (currentDepth >= 40) {
      console.log("Too much exploration");
      return null;
    }

    //I explore the cell and mark it as such
    this.#internalBoard[x][y].explored = true;

    //If it is the gold => return
    if (this.#board[x][y].states.GOLD) {
      console.log("Found the gold");
      console.log(currentPos);
      return [currentPos];
    }

    //I check that it isn't the WELL or the WUMPUS
    if (this.#board[x][y].states.WELL || this.#board[x][y].states.WUMPUS) {
      console.log("Game over");
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

    console.log("Iteration: " + currentDepth + "--------------------");
    console.log(currentPos);
    console.log("total neighbours");
    console.log(neighbours);

    //now we order the neighbours and explore the optimal one
    neighbours = this.#orderNeighbours(neighbours, this.#internalBoard);
    if (neighbours.length == 0) {
      console.log("No more paths");
      return null;
    }

    //we define the situation
    console.log("unexplored neighbours");
    console.log(neighbours);
    console.log("\n");

    for (let i = 0; i < neighbours.length; i++) {
      const res: Array<Position> = this.explore(
        neighbours[i],
        currentDepth + 1
      );
      if (res != null) {
        const path = [currentPos, ...res];
        console.log("path is");
        console.log(path);
        return path;
      }
    }

    return null;
  }
}
