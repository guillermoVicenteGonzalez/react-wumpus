import { CellType, Position } from "../types";

type internalCell = {
	explored: boolean;
	state: "dangerous" | "insecure" | "secure";
};

let board: CellType[][];
let internalBoard: internalCell[][];
let size: number;

function getNeighbours(pos: Position, size: number) {
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

//heuristic really
function orderNeighbours(
	neighbours: Position[],
	internalBoard: internalCell[][]
) {
	return neighbours
		.sort((n1, n2) => {
			if (internalBoard[n1.x][n1.y].state == "secure") return 1;
			if (internalBoard[n1.x][n1.y].state == "dangerous") return -1;
			if (
				internalBoard[n1.x][n1.y].state == "insecure" &&
				internalBoard[n2.x][n2.y].state != "dangerous"
			)
				return -1;
			return 0;
		})
		.sort((n1, n2) => {
			if (
				internalBoard[n1.x][n2.y].explored &&
				!internalBoard[n1.x][n1.y].explored
			)
				return 1;
			if (
				!internalBoard[n1.x][n2.y].explored &&
				internalBoard[n1.x][n1.y].explored
			)
				return -1;
			return 0;
		});
}

/*if we find  a insecure cell (stench / breeze) we check its surroundings (explored)
if some of its surrounding cells are also insecure we can deduce if there is a dangerous cell*/
function checkSurrounding({ x, y }: Position, board: internalCell[][]) {}

//if we find a
function setInsecureCell() {}

function explore(currentPos: Position) {
	//exploro la casilla
	internalBoard[currentPos.x][currentPos.y].explored = true;

	//compruebo si es unsafe y en caso afirmativo lo anoto
	if (
		board[currentPos.x][currentPos.y].states.BREEZE ||
		board[currentPos.x][currentPos.y].states.STENCH
	) {
		internalBoard[currentPos.x][currentPos.y].state = "insecure";
		return;
	}

	//ordeno los vecinos segun la heuristica y repito el proceso para cada uno de ellos
	let neighbours = getNeighbours(currentPos, size);
	neighbours = orderNeighbours(neighbours, internalBoard);
	neighbours.forEach((n) => {
		explore(n);
	});
	//verificamos si sabemos si es segura o insegura
	//si es segura exploramos
}

export default () => {
	// console.log(neighbours({ x: 5, y: 5 }, 10));
};
