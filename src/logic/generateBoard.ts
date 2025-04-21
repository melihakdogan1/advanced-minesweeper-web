import {Cell} from "./types";

// Count nearby mines for a given cell
function countNearbyMines(board: Cell[][], row: number, col: number): number {
    let count = 0;
    const directions = [-1,0,1];

    for(let dx of directions) {
        for(let dy of directions) {
            if(dx == 0 && dy == 0) continue;

            const newRow = row + dx;
            const newCol = col + dy;

            if(newRow >= 0 && newRow < board.length && 
               newCol >= 0 && newCol < board[0].length &&
               board[newRow][newCol].isMine
            ) {
                count++;
            }
        }
    }
    return count;
}

export function generateBoard(rows: number, cols: number, mines: number): Cell[][] {
    // Step 1: Create empty grid
    const board: Cell[][] = [];
    for(let row = 0; row < rows; row++) {
        const rowCells: Cell[] = [];
        for(let col = 0; col < cols; col++) {
            rowCells.push({
                row,
                col,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                nearbyMines: 0,
            });
        }
        board.push(rowCells);
    }

    // Step 2: Place mines randomly
    let placedMines = 0;
    while(placedMines < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if(!board[r][c].isMine) {
            board[r][c].isMine = true;
            placedMines++;
        }
    }

    // Step 3: Count nearby mines for each cell
    for(let row = 0; row < rows; row++) {
        for(let col = 0; col < cols; col++) {
            board[row][col].nearbyMines = countNearbyMines(board, row, col);
        }
    }
    return board;
}