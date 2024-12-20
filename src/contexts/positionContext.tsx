import type { Position } from "../types";
import { createContext } from "react";
import usePlayerPos from "../hooks/usePlayerPos";

interface PlayerPosProviderValue {
  playerPos: Position;
  updatePlayerPos: (nPos: Position) => number;
}

export const PlayerPosContext = createContext<PlayerPosProviderValue>({
  playerPos: { x: 0, y: 0 },
  updatePlayerPos: () => {
    return -1;
  },
});

interface PlayerPosProviderProps {
  children: React.ReactNode;
  size: number;
  startingPos: Position;
}

export const PlayerPosContextProvider: React.FC<PlayerPosProviderProps> = ({
  children,
  size = 10,
  startingPos = { x: 0, y: 0 },
}) => {
  const { playerPos, updatePlayerPos } = usePlayerPos(startingPos, size);
  return (
    <PlayerPosContext.Provider value={{ playerPos, updatePlayerPos }}>
      {children}
    </PlayerPosContext.Provider>
  );
};
