import { useState, useContext, useCallback, useEffect } from "react";
import type { Position } from "./types";
import "./App.scss";
import Board from "./components/Board/Board";
import DashBoard from "./components/dashboard/Dashboard";
import MobileCtrl from "./components/MobileCtrl/MobileCtrl";
import { comparePosition, useBoard } from "./hooks/useBoard";
import { useGameState, type GameState } from "./hooks/useGameState";
import { useInput } from "./hooks/useInput";
import useAiPlayer from "./hooks/useAIPlayer";
import Player from "./components/player/player";
import Modal from "./components/modal/Modal";
import { PlayerPosContext } from "./contexts/positionContext";
import { playerInputEventType } from "./hooks/useInput";
import usePlayerPos from "./hooks/usePlayerPos";

const aiMoveTime = 500; //500 ms
const startingPos = { x: 0, y: 0 };

function App() {
  const [boardSize, setBoardSize] = useState(10);
  const [boardVisible, setBoardVisible] = useState(false);
  const { board, visitCell, checkCell, resetBoard } = useBoard(boardSize);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { playerPos, updatePlayerPos } = usePlayerPos(startingPos, boardSize);
  const [hasGold, setHasGold] = useState(false);
  const { gameState, setGameState } = useGameState("PLAYING", onStateChange);
  const { playerInputEvent } = useInput();
  const aiPlayer = useAiPlayer(boardSize, board);

  const modalCallback = useCallback(() => {
    if (gameState === "GAME OVER" || gameState === "VICTORY") {
      gameCleanup();
    }
    setModalVisible(false);
  }, [gameState]);

  useEffect(() => {
    document.addEventListener(
      playerInputEvent.current.type,
      handleInput as EventListener
    );

    return () => {
      document.removeEventListener(
        playerInputEvent.current.type,
        handleInput as EventListener
      );
    };
  }, [playerInputEvent, board, modalVisible]);

  //gets the path to the gold and invokes periodically aiExplore to advance
  function handleAi(startingPos: Position) {
    console.log("handle ai");
    const path = aiPlayer.current.explore(startingPos, 0);
    if (!path) return false;
    const exploreCoroutine = aiVisualExplore(path);
    const interval = setInterval(() => exploreCoroutine.next(true), aiMoveTime);

    function stopExploringInterval() {
      clearInterval(interval);
      removeEventListener("keydown", stopExploringInterval);
    }

    addEventListener("keydown", stopExploringInterval);
  }

  function* aiVisualExplore(path: Position[]) {
    // for (let i = 0; i < path.length; i++) {
    //   movePlayer({ x: path[i].y, y: path[i].x });
    //   yield;
    // }

    // for (let i = path.length - 2; i >= 0; i--) {
    //   movePlayer({ x: path[i].y, y: path[i].x });
    //   yield;
    // }
    let flag = false;
    let i = 0;

    do {
      movePlayer({ x: path[i].y, y: path[i].x });
      i++;
      flag = yield;
    } while (i < path.length && flag);

    i--;
    do {
      movePlayer({ x: path[i].y, y: path[i].x });
      flag = yield;
      i--;
    } while (i >= 0 && flag);
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

  function handleInput({ detail }: playerInputEventType) {
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

  function gameCleanup() {
    resetBoard();
    updatePlayerPos({ x: 0, y: 0 });
    setHasGold(false);
    setGameState("PLAYING");
  }

  //this could / should be a useEffect ?
  function movePlayer({ x, y }: Position) {
    //visit the previous cell (just in case)
    let playerHasGold: boolean = hasGold;
    visitCell(playerPos);
    console.log(x, y);

    const err = updatePlayerPos({ x, y });
    console.log(`the error is ${err}`);
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

  /*------------------------------------
  * Dashboard callbacks
  --------------------------------------*/

  function handleResize(nSize: number) {
    setBoardSize(nSize);
  }

  function toggleBoardVisibility(flag: boolean) {
    setBoardVisible(flag);
  }

  // function resetBoard() {}

  return (
    <>
      <div className="app-container layout">
        <DashBoard
          onResetBoard={gameCleanup}
          startAi={() => {
            handleAi({ x: playerPos.y, y: playerPos.x });
          }}
          size={boardSize}
          onSizeChange={handleResize}
          setBoardVisible={toggleBoardVisibility}
        ></DashBoard>
        <Board size={boardSize} visible={boardVisible} board={board}>
          <Player position={playerPos} hasGold={hasGold}></Player>
        </Board>
      </div>
      <MobileCtrl />
      <Modal visible={modalVisible} onModalClose={modalCallback}>
        <h1>{errorMsg}</h1>
      </Modal>
    </>
  );
}

export default App;
