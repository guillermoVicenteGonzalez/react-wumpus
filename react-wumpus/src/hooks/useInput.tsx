import { useState, useEffect, useRef } from "react";

export interface playerInputEvent extends CustomEvent {
	detail: Inputs;
}

export type Inputs =
	| "UP"
	| "DOWN"
	| "LEFT"
	| "RIGHT"
	| "ACCEPT"
	| "CANCEL"
	| null;

export const useInput = () => {
	const [input, setInput] = useState<Inputs>(null);
	const playerInputEvent = useRef<CustomEvent>(
		new CustomEvent("playerInput", {
			detail: input,
		})
	);

	function handleKeyDown(event: any) {
		// function handleKeyDown(event: KeyboardEvent) {
		let flag = true;
		switch (event.key) {
			case "w":
			case "ArrowUp":
				setInput("UP");
				playerInputEvent.current = new CustomEvent("playerInput", {
					detail: "UP",
				});
				break;

			case "s":
			case "ArrowDown":
				setInput("DOWN");
				playerInputEvent.current = new CustomEvent("playerInput", {
					detail: "DOWN",
				});
				break;

			case "a":
			case "ArrowLeft":
				setInput("LEFT");
				playerInputEvent.current = new CustomEvent("playerInput", {
					detail: "LEFT",
				});
				break;

			case "d":
			case "ArrowRight":
				setInput("RIGHT");
				playerInputEvent.current = new CustomEvent("playerInput", {
					detail: "RIGHT",
				});
				break;

			case "Enter":
				setInput("ACCEPT");
				playerInputEvent.current = new CustomEvent("playerInput", {
					detail: "ACCEPT",
				});
				break;

			case "Escape":
				setInput("CANCEL");
				playerInputEvent.current = new CustomEvent("playerInput", {
					detail: "CANCEL",
				});
				break;

			default:
				//not an "approved action => no flag"
				flag = false;
		}

		if (flag) document.dispatchEvent(playerInputEvent.current);
	}

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return { input, playerInputEvent };
};
