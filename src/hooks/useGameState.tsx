import { useEffect, useState } from "react";

export type GameState = "VICTORY" | "GAME OVER" | "PLAYING";

export const useGameState = (
  initialState: GameState,
  onStateChange: (state: GameState) => void
) => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  useEffect(() => {
    onStateChange(gameState);
  }, [gameState, onStateChange]);

  return { gameState, setGameState };
};
