import { type Position, type CellType } from "../../types";
import "./cell.scss";

interface Props {
	position: Position;
	visited: Boolean;
	type: CellType;
}

const Cell: React.FC<CellType> = ({ position, visited, type }) => {
	const cellState = visited ? "cell--visited" : "";

	return <div className={`cell ${cellState}`}></div>;
};

export default Cell;
