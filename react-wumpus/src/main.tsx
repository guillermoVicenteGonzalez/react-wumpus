import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import { PlayerPosContextProvider } from "./contexts/positionContext";

const boardSize = 10;
const startingPos = { x: 0, y: 0 };

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PlayerPosContextProvider size={boardSize} startingPos={startingPos}>
      <App />
    </PlayerPosContextProvider>
  </StrictMode>
);
