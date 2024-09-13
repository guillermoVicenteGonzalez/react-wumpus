import { useState } from "react";

import "./App.css";
import Board from "./components/Board/Board";

function App() {
	const [count, setCount] = useState(10);

	return (
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
	);
}

export default App;
