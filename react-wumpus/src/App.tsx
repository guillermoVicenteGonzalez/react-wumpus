import { useState } from "react";
import type { Position } from "./types";
import "./App.css";
import Board from "./components/Board/Board";
import { PlayerPosContextProvider } from "./contexts/positionContext";

const startingPos: Position = { x: 1, y: 1 };

function App() {
	const [boardSize, setBoardSize] = useState(10);

	function handleResize(event: React.ChangeEvent<HTMLInputElement>) {
		let nSize = Number(event.target.value);
		setBoardSize(nSize);
	}

	return (
		<PlayerPosContextProvider size={boardSize} startingPos={startingPos}>
			<div className="app-container">
				<Board size={boardSize}></Board>
				<input
					max={20}
					min={0}
					type="range"
					value={boardSize}
					onChange={handleResize}
				></input>
				<span>{boardSize}</span>
			</div>
		</PlayerPosContextProvider>
	);
}

export default App;
