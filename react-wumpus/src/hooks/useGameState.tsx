import { useEffect, useState } from "react";

type GameState = "VICTORY" | "GAME OVER" | "PLAYING";

export const useGameState = (
	initialState: GameState,
	onStateChange: (state: GameState) => void
) => {
	const [gameState, setGameState] = useState<GameState>(initialState);

	useEffect(() => {
		onStateChange(gameState);
	}, [gameState]);

	return { gameState, setGameState };
};
