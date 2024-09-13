const CELL_STATES = {
	WUMPUS: "w",
	PLAYER: "p",
	BREEZE: "b",
	STENCH: "s",
	EMPTY: " ",
} as const;

export type CellType = keyof typeof CELL_STATES;
