import { useContext, useEffect, useState } from "react";
import "./board.scss";
import Player from "../player/player";
import { type Position, type CellType } from "../../types";
import Cell from "./Cell";
import { useBoard } from "../../hooks/useBoard";
import Modal from "../modal/Modal";
import { PlayerPosContext } from "../../contexts/positionContext";

interface Props {
	size: number;
}

const Board: React.FC<Props> = ({ size = 10 }) => {
	const [gameOver, setGameOver] = useState(false);
	const { board, visitCell, checkCell, resetBoard } = useBoard(size);
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const { playerPos, updatePlayerPos } = useContext(PlayerPosContext);
	const [hasGold, setHasGold] = useState(false);

	useEffect(() => {
		if (gameOver) {
			//modal
			setModalVisible(true);
			setErrorMsg("Game over");

			//cleanup
			gameCleanup();

			//setGameOver(false)
		}
	}, [gameOver]);

	function handleCloseModal() {
		setModalVisible(false);
	}

	function gameCleanup() {
		resetBoard();
		updatePlayerPos({ x: 1, y: 1 });
		setHasGold(false);
	}

	function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {
		let tempPos: Position = { ...playerPos };
		if (modalVisible) return;

		if (event.code === "ArrowUp" || event.code === "w") {
			tempPos.y--;
		}

		if (event.code === "ArrowDown" || event.code === "s") {
			tempPos.y++;
		}

		if (event.code === "ArrowLeft" || event.code === "a") {
			tempPos.x--;
		}

		if (event.code === "ArrowRight" || event.code === "d") {
			tempPos.x++;
		}

		movePlayer(tempPos);
	}

	//se multiplican los indices por el tamaño de celda => posicion
	function movePlayer({ x, y }: Position) {
		//visit the previous cell (just in case)
		visitCell(playerPos);

		let err = updatePlayerPos({ x, y });
		if (err === -1) {
			setModalVisible(true);
			setErrorMsg("The player is out of bounds");
			return;
		}

		//check wumpus / well
		visitCell({ x, y });
		if (checkCell({ x, y }).states.WUMPUS || checkCell({ x, y }).states.WELL) {
			setGameOver(true);
			return;
		}

		if (checkCell({ x, y }).states.GOLD) setHasGold(true);

		//uncover next cell
	}

	const dinamicBoardStyes = {
		"--cell-size": "5rem",
		"--board-size": size,
	} as React.CSSProperties;

	return (
		<div
			className="board"
			style={dinamicBoardStyes}
			onKeyDown={handleKeyPress}
			tabIndex={0}
		>
			<Player position={playerPos} hasGold={hasGold}></Player>
			{board.map((row) => {
				return row.map(({ states, visited, position }: CellType) => {
					return (
						<Cell
							states={states}
							key={position.x + position.y}
							position={position}
							visited={visited}
						></Cell>
					);
				});
			})}

			<footer>
				<h1>Debug</h1>
				<h2>
					Player pos x: {playerPos.x} y: {playerPos.y}
				</h2>
			</footer>

			<Modal visible={modalVisible} onModalClose={handleCloseModal}>
				<h1>{errorMsg}</h1>
			</Modal>
		</div>
	);
};

export default Board;
