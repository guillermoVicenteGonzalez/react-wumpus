# react-wumpus

A World of wumpus clone made using react + ts

## To do

- [x] basics
  - [x] cell colors
  - [x] Create reducer / context
    - The reducer is redundant / adds to much complexity ?
  - [x] Obstacles cannot be in the starting pos
- [ ] styles
- [x] correct resizing
- [x] game logic
- [x] Self play (backtracking?)
- [x] Correct event typing
- [x] Show board
- [ ] Play again => reset board (with reset gold etc)
- [ ] on game over or similar => board reset => player AI
- [ ] Restart AI from player position
  - [ ] Works, but the internal board was not updated =>
    - update internal board useEffect needed => sets visited and obstacles according to the changes on the board

## Notes

- board creation has become too cluttered.
- input handling should be a global context or a reducer called direction. That way it can be handled in the app component but

- I broke inputs again. This time is due to modalVisible for whatever reason (the reason is batching?)
  Before, the method was executed with the onkey press method specified in the tag itself, therefore, on each render the component returns the html structure with the updated function.
  Now it is handled internally using custom events and the function's data is assigned only once (even states), that is why it now breaks
  The same happens with the modal. When pressing the button, the function will read the latest gameState state and run the cleanup.
  However if inter is pressed instead, the function assigned to the enter event will remain unnchanged since its declaration.

- The solution to this is to add the variables used inside the callback to a useEffect and assign the custom event's callback inside thet useEffect

```tsx
useEffect(() => {
	document.addEventListener(playerInputEvent.current.type, handleInput);

	return () => {
		document.removeEventListener(playerInputEvent.current.type, handleInput);
	};
}, [playerInputEvent, board, modalVisible]);
...
	function handleInput({ detail }: playerInputEvent) {
		const direction = detail;
		let tempPos: Position = { ...playerPos };

		if (modalVisible) return;

		switch (direction) {
			case "UP":
				tempPos.y--;
				break;

			case "DOWN":
				tempPos.y++;
				break;

			case "LEFT":
				tempPos.x--;
				break;

			case "RIGHT":
				tempPos.x++;
				break;
		}

		if (!comparePosition(tempPos, playerPos)) movePlayer(tempPos);
	}
```

Why is this neccesary ? If we handled this the normal way, eg onSubmit button, the function handleInput is recreated each render and on each render reassigned to the onClick event of the rendered button.
If handling this with document.addEventListenr, we are recreating the function yes, but not assigning the updated function with its updated value, we are only adding the callback to the event whenever useEffect is triggered, so we might have an outdated version.

With the modal the issue is similar

```tsx
useEffect(() => {
  document.addEventListener(playerInputEvent.current.type, handleCancelKey);

  return () => {
    document.removeEventListener(
      playerInputEvent.current.type,
      handleCancelKey
    );
  };
}, []);

function handleCancelKey({ detail }: playerInputEvent) {
  if (detail == "CANCEL" || detail == "ACCEPT") {
    onModalClose();
  }
}
```

We are only assigning the event the first declaration of handleCancelKey, which has the first declaration of onModalClose, therefore, if using onClick, we will have the updated onModalClose, but the eventListener willremain as is.
The solution is to add onModalClose to the dependency array so the event listener gets reassigned the function whe it needs to.

```tsx
useEffect(() => {
  document.addEventListener(playerInputEvent.current.type, handleCancelKey);

  return () => {
    document.removeEventListener(
      playerInputEvent.current.type,
      handleCancelKey
    );
  };
}, [onModalClose]);

function handleCancelKey({ detail }: playerInputEvent) {
  if (detail == "CANCEL" || detail == "ACCEPT") {
    onModalClose();
  }
}
```

To make this event better, the parent of the modal component, who holds the declaration of the onModalCloseFunction (as it is passed as a prop) can redeclarate the function on each render OR use a useCallback to only redeclarate it when it is needed.

```tsx
const modalCallback = useCallback(() => {
  console.log(gameState);
  if (gameState === "GAME OVER" || gameState === "VICTORY") {
    console.log("cleanup");
    gameCleanup();
  }
  setModalVisible(false);
}, [gameState]);
```
