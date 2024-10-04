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
	state?: "dangerous" | "insecure" | "secure";
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
		this.#internalBoard = new Array(size).fill(
			new Array(size).fill({ explored: false })
		);
	}

	setBoard(nBoard: CellType[][]) {
		this.#board = nBoard;
	}

	resetInternalBoard() {
		this.#internalBoard = new Array(this.#size).fill(
			new Array(this.#size).fill({ explored: false })
		);
	}

	setSize(nSize: number) {
		this.#size = nSize;
		this.resetInternalBoard();
	}

	#getNeighbours(pos: Position, size: number) {
		let cells: Position[] = [];

		for (let i = -1; i <= 2; i += 2) {
			for (const key in pos) {
				let auxPos = { ...pos };
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

	#checkSafeCell(cell: CellType) {
		if (
			!cell.states.BREEZE &&
			!cell.states.WUMPUS &&
			!cell.states.STENCH &&
			!cell.states.WELL
		) {
			return false;
		}

		return true;
	}

	#orderNeighbours(neighbours: Position[], internalBoard: internalCell[][]) {
		let localNeighbours = [...neighbours];

		//primero filtro las posiciones seguras.
		localNeighbours = localNeighbours.filter(({ x, y }) => {
			return internalBoard[x][y].state != "insecure";
		});

		//luego ordeno en funcion de si están explorados o no.
		localNeighbours = localNeighbours.sort((n1, _n2) => {
			if (internalBoard[n1.x][n1.y].explored) return -1;
			return 1;
		});

		return localNeighbours;
	}

	explore(currentPos: Position, _action?: () => void) {
		//exploro la casilla
		const { x, y } = currentPos;
		this.#internalBoard[x][y].explored = true;

		//si encuentro el oro vuelvo.
		if (this.#board[x][y].states.GOLD) return [currentPos];

		//obtengo sus vecinos
		let neighbours = this.#getNeighbours(currentPos, this.#size);

		//si es una casilla segura => las que la rodean tambien (sus vecinos).
		if (this.#checkSafeCell(this.#board[x][y])) {
			neighbours.forEach((p) => {
				if (!this.#internalBoard[p.x][p.y].explored)
					this.#internalBoard[p.x][p.y].state = "secure";
			});
		} else {
			neighbours.forEach((p) => {
				//if the cell is unexplored
				if (
					!this.#internalBoard[p.x][p.y].explored &&
					this.#internalBoard[p.x][p.y].state != "secure"
				)
					this.#internalBoard[p.x][p.y].state = "insecure";
			});
		}

		//ahora ordenamos los vecinos siguiendo la heuristica
		neighbours = this.#orderNeighbours(neighbours, this.#internalBoard);
		//y los vamos visitando haciendo llamadas recursivas.
		neighbours.forEach((p) => {
			let res = this.explore(p);
			if (res != null) {
				return [currentPos, ...res];
			}
		});
	}
}
