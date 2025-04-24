import React, { useState, useEffect } from "react";
import { generateBoard } from "../logic/generateBoard";
import { Cell } from "../logic/types";
import { FaLightbulb } from "react-icons/fa";

// Define difficulty levels
type Difficulty = "easy" | "medium" | "hard";

const difficultySettings = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 24, cols: 24, mines: 99 },
};

function App() {
const overlayStyle: React.CSSProperties = {
  position: "absolute",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  fontSize: "32px",
  zIndex: 10,
};

const buttonStyle: React.CSSProperties = {
  marginTop: "20px",
  padding: "10px 20px",
  fontSize: "18px",
  cursor: "pointer",
};

  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameKey, setGameKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<
  { row: number; col: number; certainty: "certain" | "probable" }[]
  >([]);
  const [aiUsesLeft, setAiUsesLeft] = useState(3);

  const { rows, cols, mines } = difficultySettings[difficulty];

  useEffect(() => {
    const newBoard = generateBoard(rows, cols, mines);
    setBoard(newBoard);
    setAiSuggestions([]);
    setGameOver(false);
    setWin(false);
    setAiUsesLeft(3);
  }, [difficulty, gameKey]);

  function handleCellClick(row: number, col: number) {
    if (gameOver || win) return;

    setBoard((prev) => {
      const updated = prev.map((r) => r.map((c) => ({ ...c })));
      const cell = updated[row][col];

      if (cell.isRevealed || cell.isFlagged) return prev;

      cell.isRevealed = true;

      if (cell.isMine) {
        updated.forEach((row) => row.forEach((c) => { if (c.isMine) c.isRevealed = true; }));
        setGameOver(true);
        return updated;
      }

      if (cell.nearbyMines === 0) {
        revealEmptyCells(updated, row, col);
      }

      const totalSafeCells = rows * cols - mines;
      const revealedCount = updated.flat().filter((c) => c.isRevealed).length;

      if (revealedCount === totalSafeCells) {
        updated.forEach((row) => row.forEach((c) => { if (c.isMine) c.isFlagged = true; }));
        setWin(true);
      }

      return updated;
    });
  }

  function handleRightClick(e: React.MouseEvent, row: number, col: number) {
    e.preventDefault();
    setBoard((prev) => {
      const updated = prev.map((r) => r.map((c) => ({ ...c })));
      const cell = updated[row][col];

      if (!cell.isRevealed) {
        cell.isFlagged = !cell.isFlagged;
      }

      return updated;
    });
  }

  function revealEmptyCells(board: Cell[][], row: number, col: number) {
    const directions = [-1, 0, 1];

    for (let dx of directions) {
      for (let dy of directions) {
        const newRow = row + dx;
        const newCol = col + dy;

        if (
          (dx !== 0 || dy !== 0) &&
          newRow >= 0 &&
          newRow < board.length &&
          newCol >= 0 &&
          newCol < board[0].length
        ) {
          const neighbor = board[newRow][newCol];
          if (!neighbor.isRevealed && !neighbor.isMine && !neighbor.isFlagged) {
            neighbor.isRevealed = true;
            if (neighbor.nearbyMines === 0) {
              revealEmptyCells(board, newRow, newCol);
            }
          }
        }
      }
    }
  }

  function calculateAISuggestions(board: Cell[][]): {
    row: number;
    col: number;
    certainty: "certain" | "probable";
  }[] {
    const suggestions: {
      row: number;
      col: number;
      certainty: "certain" | "probable";
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
  
        if (hidden === cell.nearbyMines) {
          neighbors.forEach((n) => {
            if (!suggestions.some((s) => s.row === n.row && s.col === n.col)) {
              suggestions.push({ ...n, certainty: "probable" });
            }
          });
        }
  
        const flaggedCount = neighbors.filter((n) =>
          suggestions.some(
            (s) => s.row === n.row && s.col === n.col && s.certainty === "probable"
          )
        ).length;
  
        if (flaggedCount === cell.nearbyMines) {
          neighbors.forEach((n) => {
            if (!suggestions.some((s) => s.row === n.row && s.col === n.col)) {
              suggestions.push({ ...n, certainty: "certain" });
            }
          });
        }
      }
    }
  
    return suggestions;
  }
  

  function useAiHint() {
    if (aiUsesLeft > 0 && !gameOver && !win && difficulty === "hard") {
      const suggestions = calculateAISuggestions(board);
      const filtered = suggestions.filter(
        (s) => s.certainty === "certain" || s.certainty === "probable"
      );
  
      if (filtered.length > 0) {
        setAiSuggestions(filtered);
        setAiUsesLeft((prev) => prev - 1);
      } else {
        alert("No certain AI suggestions available right now, please make another move.");
      }
    }
  }  
  
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", position: "relative" }}>
      {/* ===== GAME OVER & WIN OVERLAY ===== */}
      {gameOver && (
        <div style={overlayStyle}>
          💥 <strong>Game Over!</strong>
          <button style={buttonStyle} onClick={() => setGameKey((k) => k + 1)}>
            🔄 Restart
          </button>
        </div>
      )}
      {win && (
        <div style={overlayStyle}>
          🎉 <strong>You Win!</strong>
          <button style={buttonStyle} onClick={() => setGameKey((k) => k + 1)}>
            🔄 Play Again
          </button>
        </div>
      )}
      {/* ===================================== */}
      {gameOver && <p style={{ color: "red" }}>💥 You hit a mine! Game Over!</p>}
      {win && <p style={{ color: "green" }}>🎉 You cleared the field! You win!</p>}
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
        🚀 Advanced Minesweeper Web
      </h1>

      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
        <label>Select difficulty: </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
        >
          <option value="easy">Easy (8x8, 10 mines)</option>
          <option value="medium">Medium (16x16, 40 mines)</option>
          <option value="hard">Hard (24x24, 99 mines)</option>
        </select>

        <button
          onClick={() => setGameKey((prev) => prev + 1)}
          style={{ padding: "5px 10px" }}
        >
          🔄 Restart
        </button>

        {difficulty === "hard" && (
          <button
            onClick={useAiHint}
            disabled={aiUsesLeft === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              backgroundColor: aiUsesLeft === 0 ? "#ccc" : "#fef08a",
              border: "1px solid #aaa",
              cursor: aiUsesLeft === 0 ? "not-allowed" : "pointer",
              color: aiUsesLeft === 0 ? "#777" : "black",
            }}
          >
            <FaLightbulb /> Hint ({aiUsesLeft})
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 30px)`,
          gap: "2px",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: "30px",
                height: "30px",
                border: "1px solid #888",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                cursor: gameOver || win ? "not-allowed" : "pointer",
                backgroundColor: cell.isRevealed
                ? "#e2e8f0"
                : aiSuggestions.some(
                    (s) =>
                    s.row === rowIndex &&
                    s.col === colIndex &&
                    s.certainty === "certain"
                  )
                ? "#d1fae5"
                : aiSuggestions.some(
                    (s) =>
                    s.row === rowIndex &&
                    s.col === colIndex &&
                    s.certainty === "probable"
                  )
                ? "#fef9c3"
                : "#f8fafc",
              }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
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
          ))
        )}
      </div>
    </div>
  );
}

export default App;


