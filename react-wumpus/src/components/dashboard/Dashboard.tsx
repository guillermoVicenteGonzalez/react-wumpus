import Cell from "../Board/Cell";
import { useState } from "react";

interface DashBoardProps {
  size: number;
  onSizeChange: (nSize: number) => void;
  action?: () => void;
}

const DashBoard: React.FC<DashBoardProps> = ({
  size,
  onSizeChange,
  action,
}) => {
  const [visible, setVisible] = useState<boolean>(true);

  function handleSizeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nSize = Number(event.target.value);
    onSizeChange(nSize);
  }

  function handleModalVisibility() {
    setVisible((v) => !v);
  }

  return (
    <div className={`dashboard ${visible && `dashboard--closed`}`}>
      <button
        className={`dashboard__close-btn ${
          visible && `dashboard__close-btn--closed`
        }`}
        onClick={handleModalVisibility}
      >
        <div className="btn-line"></div>
      </button>
      <h1 className="dashboard__title">React wumpus</h1>
      <div className="dashboard__section">
        <h1 className="dashboard__section__title">Objective</h1>
        <p className="dashboard__section__text">
          The objective of the game is to get the gold and return to the
          starging plaze without falling into a well or running into the wumpus
        </p>
      </div>

      <div className="dashboard__section">
        <h2 className="dashboard__section__title">Rules</h2>
        <p className="dashboard__section__text">
          Every cell but the starting one is hidden. Upon visiting a cell, its
          content will be revealed. Cells can contain stench, breeze,
          stench-breeze, gold, wumpus or well.
        </p>

        <p className="dashboard__section__text">
          Finding breeze will mean there is a Well cell at a 1-cell distance.
          Finding stench will mean the wumpus is at a 1-cell distance.
          (diagonals are not contemplated)
        </p>
      </div>

      <div className="dashboard__section">
        <h2 className="dashboard__section__title">Controls</h2>
        <p className="dashboard__section__text">
          Use WASD to move or the arrow keys
        </p>
      </div>

      <div className="dashboard__section">
        <h2 className="dashboard__section__title">References</h2>
        <div className="cell-references">
          <div className="cell-references__cell-block">
            <Cell states={{}} visited={false} />
            <label className="cell-references__label">Unexplored cell</label>
          </div>

          <div className="cell-references__cell-block">
            <Cell states={{}} visited={true} />
            <label className="cell-references__label">Explored cell</label>
          </div>

          <div className="cell-references__cell-block">
            <Cell states={{ WUMPUS: true }} visited={true} />
            <label className="cell-references__label">Wumpus cell</label>
          </div>

          <div className="cell-references__cell-block">
            <Cell states={{ WELL: true }} visited={true} />
            <label className="cell-references__label">Well cell</label>
          </div>

          <div className="cell-references__cell-block">
            <Cell states={{ BREEZE: true }} visited={true} />
            <label className="cell-references__label">Breeze cell</label>
          </div>

          <div className="cell-references__cell-block">
            <Cell states={{ STENCH: true }} visited={true} />
            <label className="cell-references__label">Stench cell</label>
          </div>

          <div className="cell-references__cell-block">
            <Cell states={{ STENCH: true, BREEZE: true }} visited={true} />
            <label className="cell-references__label">
              Stench + breeze cell
            </label>
          </div>

          <div className="cell-references__cell-block">
            <Cell states={{ GOLD: true }} visited={true} />
            <label className="cell-references__label">Gold cell</label>
          </div>
        </div>
      </div>

      <div className="dashboard__section size-control">
        <input
          className="size-control__range"
          max={20}
          min={4}
          type="range"
          value={size}
          onChange={handleSizeChange}
        ></input>
        <span>size: {size}</span>
      </div>

      <button onClick={action}>Auto solve</button>
    </div>
  );
};

export default DashBoard;
