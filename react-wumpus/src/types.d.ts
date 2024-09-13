export type Position = {
	x: number;
	y: number;
};

const CELL_STATES = {
	WUMPUS: "w",
	BREEZE: "b",
	STENCH: "s",
	EMPTY: " ",
} as const;

export type CellType = {
	type: keyof typeof CELL_STATES;
	visited: boolean;
	position: Position;
};
