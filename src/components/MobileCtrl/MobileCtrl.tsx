import { useInput } from "../../hooks/useInput";
import useIsMobile from "../../hooks/useIsMobile";

interface MobileCtrlProps {}

const MobileCtrl: React.FC<MobileCtrlProps> = () => {
	const { sendInput } = useInput();
	const isMobile = useIsMobile();

	if (!isMobile) {
		return;
	}

	return (
		<div className="mobile-ctrl">
			<button
				className="mobile-ctrl__btn mobile-ctrl__btn--left"
				onClick={() => {
					sendInput("LEFT");
				}}
			>
				&larr;
			</button>
			<button
				className="mobile-ctrl__btn mobile-ctrl__btn--up"
				onClick={() => {
					sendInput("UP");
				}}
			>
				&uarr;
			</button>
			<button
				className="mobile-ctrl__btn mobile-ctrl__btn--right"
				onClick={() => {
					sendInput("RIGHT");
				}}
			>
				&rarr;
			</button>
			<button
				className="mobile-ctrl__btn mobile-ctrl__btn--down"
				onClick={() => {
					sendInput("DOWN");
				}}
			>
				&darr;
			</button>
		</div>
	);
};

export default MobileCtrl;
