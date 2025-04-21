import { Cell } from "./types";


// constants for cell types
export const EMPTY = 0;
export const MINE = 1;
export const OPENED = 2;
export const FLAGGED = 3;

/**
 * Generates an empty game field with all cells initialized to EMPTY (0).
 * 
 * @param size - Size of the game board (e.g., 10 for 10x10)
 * @returns A 2D array representing the empty game field
 */
export function generateEmptyField(size: number): number[][] {
    const field: number[][] = [];

    for(let i = 0; i < size; i++) {
        const row: number[] = new Array(size).fill(EMPTY);
        field.push(row);
    }
    return field;
}

export function placeMines(board: Cell[][], totalMines: number): void {
    const size = board.length;
    let placed = 0;

    while(placed < totalMines) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);

        if(!board[row][col].isMine) {
            board[row][col].isMine = true;
            placed++;
        }
    }
}

export function calculateNearbyMines(board: Cell[][]): void {
    const size = board.length;

    for(let row = 0; row < size; row++) {
        for(let col = 0; col < size; col++) {
            if(board[row][col].isMine) continue;

            let count = 0;

            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;

                    if(
                        newRow >= 0 && newRow < size &&
                        newCol >= 0 && newCol < size && 
                        board[newRow][newCol].isMine
                    ) {
                        count++;
                    }
                }
            }
            board[row][col].nearbyMines = count;
        }
    }
}
