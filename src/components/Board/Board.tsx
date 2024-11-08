import { ReactElement } from "react";
import { type CellType } from "../../types";
import Cell from "./Cell";

interface Props {
  size: number;
  className?: string;
  visible?: boolean;
  board: CellType[][];
  children: ReactElement;
}

const Board: React.FC<Props> = ({
  size = 10,
  className = "",
  visible = false,
  board = [],
  children,
}) => {
  if (board.length <= 1) return null;

  const dinamicBoardStyes = {
    "--board-size": size,
  } as React.CSSProperties;

  return (
    <div className={`board ${className}`} style={dinamicBoardStyes}>
      {children}
      {board.map((row, index) => {
        return row.map(({ states, visited, position }: CellType, jndex) => {
          return (
            <Cell
              states={states}
              key={index.toString() + jndex.toString()}
              position={position}
              visited={visible ? true : visited}
            ></Cell>
          );
        });
      })}
    </div>
  );
};

export default Board;
