import React from "react";
import {Cell} from "../logic/types";

interface GameBoardProps {
    board: Cell[][];
    onCellClick: (row: number, col: number) => void;
    onRightClick: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
    board,
    onCellClick,
    onRightClick
  }) => {
    return (
      <div className="grid" style={{
        display: "grid",
        gridTemplateColumns: `repeat(${board[0].length}, 30px)`,
        gap: "2px",
        justifyContent: "center"
      }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            let cellContent = "";
            if (cell.isRevealed) {
              cellContent = cell.isMine ? "💣" : cell.nearbyMines > 0 ? `${cell.nearbyMines}` : "";
            } else if (cell.isFlagged) {
              cellContent = "🚩";
            }
  
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onCellClick(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onRightClick(rowIndex, colIndex);
                }}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: cell.isRevealed ? "#ddd" : "#999",
                  border: "1px solid #333",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: cell.isMine ? "red" : "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                {cellContent}
              </div>
            );
          })
        )}
      </div>
    );
  };
