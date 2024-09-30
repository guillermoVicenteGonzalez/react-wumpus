import { type CellType } from "../../types";
import "./cell.scss";

const Cell: React.FC<CellType> = ({ visited, states }) => {
	const cellState = visited ? "cell--visited" : "";
	function cellColor() {
		let colors: string[] = [];

		if (states.BREEZE == true) {
			colors.push("var(--breeze-color)");
		}

		if (states.STENCH == true) {
			colors.push("var(--stench-color)");
		}

		if (states.GOLD == true) {
			colors = ["var(--gold-color)"];
		}

		if (states.WUMPUS == true) {
			colors = ["var(--wumpus-color)"];
		}

		if (states.WELL == true) {
			colors = ["var(--well-color)"];
		}
		if (states.START) {
			colors = ["var(--start-color)"];
		}

		if (colors.length > 1) {
			return {
				backgroundImage: `linear-gradient(${colors.toString()})`,
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
