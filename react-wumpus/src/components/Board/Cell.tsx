import { type Position, type CellType, CellStates } from "../../types";
import "./cell.scss";

const Cell: React.FC<CellType> = ({ position, visited, states }) => {
	const cellState = visited ? "cell--visited" : "";
	function cellColor() {
		let colors: string[] = [];
		for (let [key, value] of Object.entries(states)) {
			console.log(key);
		}
	}

	return <div className={`cell ${cellState} `}>{}</div>;
};

export default Cell;
