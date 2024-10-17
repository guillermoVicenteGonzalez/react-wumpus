export type Position = {
  x: number;
  y: number;
};

export interface CellStates {
  WUMPUS?: boolean;
  BREEZE?: boolean;
  STENCH?: boolean;
  WELL?: boolean;
  GOLD?: boolean;
  START?: boolean;
}

export type CellType = {
  states: CellStates;
  visited: boolean;
  position?: Position;
};

export type DangerousStates = CellStates.WELL | CellStates.WUMPUS;

export const dangerousStates = [Cellstate];
