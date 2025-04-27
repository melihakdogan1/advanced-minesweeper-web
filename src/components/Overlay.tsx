import React from "react";

export interface OverlayProps {
  gameOver: boolean;
  win: boolean;
  onRestart: () => void;
}

export default function Overlay({ gameOver, win, onRestart }: OverlayProps) {
  if (!gameOver && !win) return null;

  return (
    <div
      style={{
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
      }}
    >
      {gameOver ? "💥 Game Over!" : "🎉 You Win!"}
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
        }}
        onClick={onRestart}
      >
        🔄 {gameOver ? "Restart" : "Play Again"}
      </button>
    </div>
  );
}
