import { useEffect } from "react";
import { type playerInputEvent, useInput } from "../../hooks/useInput";
import "./modal.scss";

interface Props {
	visible: boolean;
	children: React.ReactNode;
	onModalClose: () => void;
}

const Modal: React.FC<Props> = ({ visible, children, onModalClose }) => {
	const visibleStyles = visible ? "modal--visible" : "modal--hidden";
	const { playerInputEvent } = useInput();

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

	return (
		<div className={`modal ${visibleStyles}`}>
			<div className="modal__content">{children}</div>
			<div className="modal__controls">
				<button onClick={onModalClose}>Accept</button>
			</div>
		</div>
	);
};

export default Modal;
