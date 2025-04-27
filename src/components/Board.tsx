import React from "react";
import Cell from "./Cell";
import { Cell as CellType } from "../logic/types";

interface Props {
  board: CellType[][];
  aiSuggestions: { row: number; col: number; certainty: string }[];
  gameOver: boolean;
  win: boolean;
  onCellClick: (r: number, c: number) => void;
  onCellRightClick: (e: React.MouseEvent, r: number, c: number) => void;
}

export default function Board({ board, aiSuggestions, gameOver, win, onCellClick, onCellRightClick }: Props) {
  const cols = board[0]?.length || 0;
  const highlightMap = new Map<string, string>();
  aiSuggestions.forEach(s => highlightMap.set(`${s.row}-${s.col}`, s.certainty));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 30px)`,
        gap: 2
      }}
    >
      {board.map((row, ri) =>
        row.map((cell, ci) => (
          <Cell
            key={`${ri}-${ci}`}
            cell={cell}
            onClick={() => onCellClick(ri, ci)}
            onContextMenu={e => onCellRightClick(e, ri, ci)}
            highlight={highlightMap.get(`${ri}-${ci}`) as any}
          />
        ))
      )}
    </div>
  );
}