import { useState, useEffect, useRef } from "react";

export interface playerInputEventType extends CustomEvent<Inputs> {
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
  const playerInputEvent = useRef<playerInputEventType>(
    new CustomEvent("playerInput", {
      detail: input,
    })
  );

  function sendInput(input: Inputs) {
    setInput(input);
    playerInputEvent.current = new CustomEvent("playerInput", {
      detail: input,
    });
    document.dispatchEvent(playerInputEvent.current);
  }

  function handleKeyDown(event: KeyboardEvent) {
    // let flag = true;
    switch (event.key) {
      case "w":
      case "ArrowUp":
        sendInput("UP");
        break;

      case "s":
      case "ArrowDown":
        sendInput("DOWN");
        break;

      case "a":
      case "ArrowLeft":
        sendInput("LEFT");
        break;

      case "d":
      case "ArrowRight":
        sendInput("RIGHT");
        break;

      case "Enter":
        sendInput("ACCEPT");
        break;

      case "Escape":
        sendInput("CANCEL");
        break;

      default:
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return { input, playerInputEvent, sendInput };
};
