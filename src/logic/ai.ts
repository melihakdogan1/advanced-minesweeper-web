import { Cell } from "./types";

export type Certainty = "certain" | "probable";

export function calculateAISuggestions(board: Cell[][]): {
  row: number;
  col: number;
  certainty: Certainty;
}[] {
  const suggestions: {
    row: number;
    col: number;
    certainty: Certainty;
  }[] = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const cell = board[row][col];
      if (!cell.isRevealed || cell.nearbyMines === 0) continue;

      const neighbors: { row: number; col: number }[] = [];
      let hidden = 0;

      for (let dx of [-1, 0, 1]) {
        for (let dy of [-1, 0, 1]) {
          if (dx === 0 && dy === 0) continue;
          const newRow = row + dx;
          const newCol = col + dy;
          if (
            newRow >= 0 &&
            newRow < board.length &&
            newCol >= 0 &&
            newCol < board[0].length
          ) {
            const neighbor = board[newRow][newCol];
            if (!neighbor.isRevealed && !neighbor.isFlagged) {
              hidden++;
              neighbors.push({ row: newRow, col: newCol });
            }
          }
        }
      }

      // if all hidden cells around must be mines → “probable”
      if (hidden === cell.nearbyMines) {
        neighbors.forEach((n) => {
          if (!suggestions.find((s) => s.row === n.row && s.col === n.col)) {
            suggestions.push({ ...n, certainty: "probable" });
          }
        });
      }

      // if flagged count equals number → remaining safe → “certain”
      const flaggedCount = neighbors.filter((n) =>
        suggestions.some(
          (s) =>
            s.row === n.row &&
            s.col === n.col &&
            s.certainty === "probable"
        )
      ).length;

      if (flaggedCount === cell.nearbyMines) {
        neighbors.forEach((n) => {
          if (!suggestions.find((s) => s.row === n.row && s.col === n.col)) {
            suggestions.push({ ...n, certainty: "certain" });
          }
        });
      }
    }
  }

  return suggestions;
}



