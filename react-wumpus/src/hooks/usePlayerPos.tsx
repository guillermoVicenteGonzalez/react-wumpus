import { useState, useEffect } from "react";
import { type Position } from "../types";

export default function usePlayerPos(startingPos: Position, limit: number) {
	const [playerPos, setPlayerPos] = useState<Position>(startingPos);

	//falta un useEffect con limit para recalcular la posicion.

	function updatePlayerPos(nPos: Position) {
		if (nPos.x > limit || nPos.y > limit || nPos.x <= 0 || nPos.y <= 0) {
			return -1;
		} else {
			setPlayerPos(nPos);
			return 1;
		}
	}

	useEffect(() => {
		setPlayerPos(startingPos);
	}, [limit]);

	return { playerPos, updatePlayerPos };
}
