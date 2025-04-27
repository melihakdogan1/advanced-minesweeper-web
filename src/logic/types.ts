export interface Cell {
    row: number;
    col: number;
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    nearbyMines: number;
}

export type Difficulty = "easy" | "medium" | "hard";

  