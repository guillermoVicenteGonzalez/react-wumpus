import { type Position, type CellType, CellStates } from "../../types";
import "./cell.scss";

const Cell: React.FC<CellType> = ({ position, visited, states }) => {
	const cellState = visited ? "cell--visited" : "";
	function cellColor() {
		let colors: string[] = [];
		if (states.GOLD == true) {
			colors.push("gold");
		}
		if (states.WUMPUS == true) {
			colors.push("green");
		}

		if (states.BREEZE == true) {
			colors.push("aliceblue");
		}

		if (states.STENCH == true) {
			colors.push("greenyellow");
		}

		if (states.WELL == true) {
			colors.push("black");
		}

		if (colors.length > 1) {
			return {
				"background-image": `linear-gradient(${colors.toString()})`,
			} as React.CSSProperties;
		} else {
			return { backgroundColor: colors.toString() } as React.CSSProperties;
		}
	}

	return (
		<div className={`cell ${cellState} `} style={cellColor()}>
			{}
		</div>
	);
};

export default Cell;
