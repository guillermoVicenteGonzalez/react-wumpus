import AIPlayer from "../AI/PlayerAI";
import { CellType } from "../types";
import { useEffect, useRef } from "react";

const useAiPlayer = (size: number, board: CellType[][]) => {
	const aiPlayer = useRef<AIPlayer>(new AIPlayer(size, board));

	useEffect(() => {
		aiPlayer.current.setSize(size);
	}, [size]);

	useEffect(() => {
		console.log("preparing board\n");
		aiPlayer.current.setBoard(board);
		aiPlayer.current.resetInternalBoard();
	}, [size]);

	return aiPlayer;
};

export default useAiPlayer;
