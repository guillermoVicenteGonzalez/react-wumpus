import AIPlayer from "../AI/PlayerAI";
import { CellType } from "../types";
import { useEffect, useRef } from "react";

const useAiPlayer = (size: number, board: CellType[][]) => {
  const aiPlayer = useRef<AIPlayer>(new AIPlayer(size, board));

  useEffect(() => {
    if (size != board.length) {
      aiPlayer.current.setSize(size);
      aiPlayer.current.setBoard(board);
    }
  }, [size, board]);

  useEffect(() => {
    aiPlayer.current.setBoard(board);
  }, [board]);

  useEffect(() => {
    aiPlayer.current.resetInternalBoard();
  }, []);

  return aiPlayer;
};

export default useAiPlayer;
