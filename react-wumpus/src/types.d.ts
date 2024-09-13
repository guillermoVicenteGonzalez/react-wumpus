export type Position = {
	x: number;
	y: number;
};

const CELL_STATES = {
	WUMPUS: "w",
	BREEZE: "b",
	STENCH: "s",
	"BREEZE-STENCH": "bs",
	EMPTY: " ",
	WELL: "p",
	GOLD: "g",
} as const;

type CellStates = {
	WUMPUS?: boolean;
	BREEZE?: boolean;
	STENCH?: boolean;
	WELL?: boolean;
	GOLD?: boolean;
};

export type CellType = {
	states: CellStates;
	visited: boolean;
	position: Position;
};
