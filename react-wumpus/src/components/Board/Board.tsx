import { useCallback, useContext, useEffect, useState } from "react";
import Player from "../player/player";
import { type Position, type CellType } from "../../types";
import Cell from "./Cell";
import { comparePosition, useBoard } from "../../hooks/useBoard";
import Modal from "../modal/Modal";
import { PlayerPosContext } from "../../contexts/positionContext";
import { useGameState } from "../../hooks/useGameState";
import { useInput } from "../../hooks/useInput";
import useAiPlayer from "../../hooks/useAIPlayer";

interface Props {
  size: number;
  className?: string;
}

type GameState = "VICTORY" | "GAME OVER" | "PLAYING";

const Board: React.FC<Props> = ({ size = 10, className = "" }) => {
  const aiMoveTime = 500; //500 ms
  const { board, visitCell, checkCell, resetBoard } = useBoard(size);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { playerPos, updatePlayerPos } = useContext(PlayerPosContext);
  const [hasGold, setHasGold] = useState(false);
  const { gameState, setGameState } = useGameState("PLAYING", onStateChange);
  const { playerInputEvent } = useInput();
  const aiPlayer = useAiPlayer(size, board);

  const modalCallback = useCallback(() => {
    if (gameState === "GAME OVER" || gameState === "VICTORY") {
      gameCleanup();
    }
    setModalVisible(false);
  }, [gameState]);

  useEffect(() => {
    document.addEventListener(playerInputEvent.current.type, handleInput);

    return () => {
      document.removeEventListener(playerInputEvent.current.type, handleInput);
    };
  }, [playerInputEvent, board, modalVisible]);

  function* aiVisualExplore(path: Position[], interval?) {
    for (let i = 0; i < path.length; i++) {
      movePlayer({ x: path[i].y + 1, y: path[i].x + 1 });
      yield;
    }

    for (let i = path.length - 2; i >= 0; i--) {
      movePlayer({ x: path[i].y + 1, y: path[i].x + 1 });
      yield;
    }

    //remove interval
  }

  function handleAi() {
    const path = aiPlayer.current.explore({ x: 0, y: 0 }, 0);
    if (!path) return false;
    const exploreCoroutine = aiVisualExplore(path);
    setInterval(() => exploreCoroutine.next(), aiMoveTime);
  }

  function handleInput({ detail }: any) {
    // function handleInput({ detail }: playerInputEvent) {
    const direction = detail;
    const tempPos: Position = { ...playerPos };

    if (modalVisible) return;

    switch (direction) {
      case "UP":
        tempPos.y--;
        break;

      case "DOWN":
        tempPos.y++;
        break;

      case "LEFT":
        tempPos.x--;
        break;

      case "RIGHT":
        tempPos.x++;
        break;
    }

    if (!comparePosition(tempPos, playerPos)) movePlayer(tempPos);
  }

  function onStateChange(state: GameState) {
    if (state === "GAME OVER") {
      setModalVisible(true);
      setErrorMsg("Game over");
    } else if (state === "VICTORY") {
      setModalVisible(true);
      setErrorMsg("VICTORY !!!");
    }
  }

  function gameCleanup() {
    resetBoard();
    updatePlayerPos({ x: 1, y: 1 });
    setHasGold(false);
    setGameState("PLAYING");
  }

  //this could / should be a useEffect ?
  function movePlayer({ x, y }: Position) {
    //visit the previous cell (just in case)
    let playerHasGold: boolean = hasGold;
    visitCell(playerPos);

    const err = updatePlayerPos({ x, y });
    if (err === -1) {
      setModalVisible(true);
      setErrorMsg("The player is out of bounds");
      return;
    }

    //check wumpus / well
    visitCell({ x, y });
    if (
      checkCell({ x, y }).states.WUMPUS === true ||
      checkCell({ x, y }).states.WELL === true
    ) {
      setGameState("GAME OVER");
      return;
    }

    if (checkCell({ x, y }).states.GOLD) {
      playerHasGold = true;
      setHasGold(playerHasGold);
    }

    if (playerHasGold && checkCell({ x, y }).states.START) {
      setGameState("VICTORY");
    }
  }

  const dinamicBoardStyes = {
    "--board-size": size,
  } as React.CSSProperties;

  return (
    <>
      <div className={`board ${className}`} style={dinamicBoardStyes}>
        <Player position={playerPos} hasGold={hasGold}></Player>
        {board.map((row) => {
          return row.map(({ states, visited, position }: CellType) => {
            return (
              <Cell
                states={states}
                key={position.x + position.y}
                position={position}
                visited={visited}
              ></Cell>
            );
          });
        })}

        <Modal visible={modalVisible} onModalClose={modalCallback}>
          <h1>{errorMsg}</h1>
        </Modal>
      </div>

      <button onClick={handleAi}>Start AI</button>
    </>
  );
};

export default Board;
