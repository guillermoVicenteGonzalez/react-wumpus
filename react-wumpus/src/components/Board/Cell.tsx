import { type Position, type CellType } from "../../types";
import "./cell.scss";

interface Props {
	position: Position;
	visited: Boolean;
	type: CellType;
}

const Cell: React.FC<CellType> = ({ position, visited, type }) => {
	const cellState = visited ? "cell--visited" : "";
	function cellColor() {
		switch (type) {
			case "WUMPUS":
				return "cell--wumpus";
			case "EMPTY":
				return "";
			case "BREEZE":
				return "cell--breeze";
			case "STENCH":
				return "cell--stench";
			case "WELL":
				return "cell--well";
		}
	}

	return <div className={`cell ${cellState} ${cellColor()}`}></div>;
};

export default Cell;
