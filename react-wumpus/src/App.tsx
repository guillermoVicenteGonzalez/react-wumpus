import { useState } from "react";
import type { Position } from "./types";
import "./App.scss";
import Board from "./components/Board/Board";
import { PlayerPosContextProvider } from "./contexts/positionContext";
import DashBoard from "./components/dashboard/Dashboard";
import MobileCtrl from "./components/MobileCtrl/MobileCtrl";

const startingPos: Position = { x: 0, y: 0 };

function App() {
  const [boardSize, setBoardSize] = useState(10);
  const [boardVisible, setBoardVisible] = useState(false);
  function handleResize(nSize: number) {
    setBoardSize(nSize);
  }

  function toggleBoardVisibility(flag: boolean) {
    setBoardVisible(flag);
  }

  return (
    <PlayerPosContextProvider size={boardSize} startingPos={startingPos}>
      <div className="app-container layout">
        <DashBoard
          size={boardSize}
          onSizeChange={handleResize}
          setBoardVisible={toggleBoardVisibility}
        ></DashBoard>
        <Board size={boardSize} visible={boardVisible}></Board>
      </div>
      <MobileCtrl />
    </PlayerPosContextProvider>
  );
}

export default App;
