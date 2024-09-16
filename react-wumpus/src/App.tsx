import { useState } from "react";
import type { Position } from "./types";
import "./App.css";
import Board from "./components/Board/Board";
import usePlayerPos from "./hooks/usePlayerPos";
import { PlayerPosContextProvider } from "./contexts/positionContext";

const startingPos: Position = { x: 1, y: 1 };

function App() {
	const [count, setCount] = useState(10);

	return (
		<PlayerPosContextProvider size={count} startingPos={startingPos}>
			<div className="app-container">
				<Board size={count}></Board>
				<input
					max={20}
					min={0}
					type="range"
					value={count}
					onChange={(event) => setCount(event.target.value)}
				></input>
				<span>{count}</span>
			</div>
		</PlayerPosContextProvider>
	);
}

export default App;
