import { generateBoard } from "./generateBoard";
import { Cell } from "./types";

describe("generateBoard()", () => {
  it("should create a board with correct dimensions and mine count", () => {
    const rows = 8, cols = 8, mines = 10;
    const board: Cell[][] = generateBoard(rows, cols, mines);

    expect(board).toHaveLength(rows);
    board.forEach(row => expect(row).toHaveLength(cols));

    const mineCount = board.flat().filter(c => c.isMine).length;
    expect(mineCount).toBe(mines);
  });

  it("should correctly calculate nearbyMines on a 3×3 board with one mine", () => {
    const rows = 3, cols = 3, mines = 1;
    const board: Cell[][] = generateBoard(rows, cols, mines);

    // exactly one mine on the board
    const mineCells = board.flat().filter(c => c.isMine);
    expect(mineCells).toHaveLength(1);

    const { row: mr, col: mc } = mineCells[0];

    // every neighbor of the mine must report 1 nearby mine
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = mr + dr, nc = mc + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          expect(board[nr][nc].nearbyMines).toBe(1);
        }
      }
    }

    // all other non‐mine, non‐neighbor cells should report 0 nearby mines
    board.flat().forEach(c => {
      const isMineCell = c.isMine;
      const isNeighbor =
        Math.abs(c.row - mr) <= 1 &&
        Math.abs(c.col - mc) <= 1 &&
        !(c.row === mr && c.col === mc);
      if (!isMineCell && !isNeighbor) {
        expect(c.nearbyMines).toBe(0);
      }
    });
  });
});

