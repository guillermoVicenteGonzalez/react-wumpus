import "./modal.scss";

interface Props {
	visible: boolean;
	children: React.ReactNode;
	onModalClose: () => void;
}

const Modal: React.FC<Props> = ({ visible, children, onModalClose }) => {
	const visibleStyles = visible ? "modal--visible" : "modal--hidden";

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
