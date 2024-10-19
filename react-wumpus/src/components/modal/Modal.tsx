import { EventHandler, useEffect } from "react";
import { playerInputEventType, useInput } from "../../hooks/useInput";

interface Props {
  visible: boolean;
  children: React.ReactNode;
  onModalClose: () => void;
}

const Modal: React.FC<Props> = ({ visible, children, onModalClose }) => {
  const visibleStyles = visible ? "modal--visible" : "modal--hidden";
  const { playerInputEvent } = useInput();

  useEffect(() => {
    document.addEventListener(
      playerInputEvent.current.type,
      handleCancelKey as EventListener
    );

    return () => {
      document.removeEventListener(
        playerInputEvent.current.type,
        handleCancelKey as EventListener
      );
    };
  }, [onModalClose]);

  function handleCancelKey({ detail }: playerInputEventType) {
    // function handleCancelKey({ detail }: playerInputEvent) {
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
