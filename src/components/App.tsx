import React, { useState, useEffect } from "react";
import Controls from "../components/Controls";
import Board from "../components/Board";
import Overlay from "../components/Overlay";
import { generateBoard } from "../logic/generateBoard";
import { Cell } from "../logic/types";
import { FaLightbulb } from "react-icons/fa";
import { calculateAISuggestions, Certainty } from "../logic/ai";
import { Difficulty } from "../logic/types";


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
  const [time, setTime] = useState(0);

  const { rows, cols, mines } = difficultySettings[difficulty];

  useEffect(() => {
    const newBoard = generateBoard(rows, cols, mines);
    setBoard(newBoard);

    setAiSuggestions([]);
    setGameOver(false);
    setWin(false);
    setAiUsesLeft(3);
    setTime(0);
    setStarted(false);
  }, [difficulty, gameKey]);

  useEffect(() => {
    // Do not start timer until first click happens;
    // and stop when game ends
    if (!started || gameOver || win) return;

    const interval = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameOver, win, gameKey]);

  const [started, setStarted] = useState(false);

  function handleCellClick(row: number, col: number) {
    if (!started) setStarted(true);
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
      {/* unified overlay component */}
      <Overlay
        gameOver={gameOver}
        win={win}
        onRestart={() => setGameKey(k => k + 1)}
      />
  
      {/* status messages */}
      {gameOver && <p style={{ color: "red" }}>💥 You hit a mine! Game Over!</p>}
      {win      && <p style={{ color: "green" }}>🎉 You cleared the field! You win!</p>}
  
      {/* title */}
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
        🚀 Advanced Minesweeper Web
      </h1>
  
      {/* controls (difficulty selector, restart, hint button, timer) */}
      <Controls
        difficulty={difficulty}
        onDifficultyChange={d => setDifficulty(d)}
        onRestart={() => setGameKey(k => k + 1)}
        aiUsesLeft={aiUsesLeft}
        onAiHint={useAiHint}
        time={time}
      />
  
      {/* the actual board grid */}
      <Board
        board={board}
        onCellClick={handleCellClick}
        onCellRightClick={handleRightClick}
        aiSuggestions={aiSuggestions}
        gameOver={gameOver}
        win={win}
      />
    </div>
  );
  
}

export default App;


