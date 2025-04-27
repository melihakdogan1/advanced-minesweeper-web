import React from "react";
import { Cell as CellType } from "../logic/types";

interface Props {
  cell: CellType;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  highlight?: "certain" | "probable";
}

export default function Cell({ cell, onClick, onContextMenu, highlight }: Props) {
  let bg = cell.isRevealed ? "#e2e8f0" : "#f8fafc";
  if (!cell.isRevealed && highlight === "certain") bg = "#d1fae5";
  if (!cell.isRevealed && highlight === "probable") bg = "#fef9c3";

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      style={{
        width: 30,
        height: 30,
        border: "1px solid #888",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        cursor: "pointer",
        backgroundColor: bg,
      }}
    >
      {cell.isRevealed
        ? cell.isMine
          ? "💣"
          : cell.nearbyMines > 0
          ? cell.nearbyMines
          : ""
        : cell.isFlagged
        ? "🚩"
        : ""}
    </div>
  );
}