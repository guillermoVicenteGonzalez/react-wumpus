import { useState } from "react";
import type { Position } from "./types";
import "./App.scss";
import Board from "./components/Board/Board";
import { PlayerPosContextProvider } from "./contexts/positionContext";
import DashBoard from "./components/dashboard/Dashboard";
import MobileCtrl from "./components/MobileCtrl/MobileCtrl";

const startingPos: Position = { x: 1, y: 1 };

function App() {
  const [boardSize, setBoardSize] = useState(10);
  function handleResize(nSize: number) {
    setBoardSize(nSize);
  }

  function handleStartAiExplore() {}

  return (
    <PlayerPosContextProvider size={boardSize} startingPos={startingPos}>
      <div className="app-container layout">
        <DashBoard
          size={boardSize}
          onSizeChange={handleResize}
          action={handleStartAiExplore}
        ></DashBoard>
        <Board size={boardSize}></Board>
      </div>
      <MobileCtrl />
    </PlayerPosContextProvider>
  );
}

export default App;
