import React from "react";
import { FaLightbulb } from "react-icons/fa";
import { Difficulty } from "../logic/types";


export interface ControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onRestart: () => void;
  aiUsesLeft: number;
  onAiHint: () => void;
  time: number;
}

export default function Controls({
  difficulty,
  onDifficultyChange,
  onRestart,
  aiUsesLeft,
  onAiHint,
  time,
}: ControlsProps) {
  return (
    <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
      <label>Select difficulty: </label>
      <select value={difficulty} onChange={e => onDifficultyChange(e.target.value as Difficulty)}>
        <option value="easy">Easy (8×8, 10 mines)</option>
        <option value="medium">Medium (16×16, 40 mines)</option>
        <option value="hard">Hard (24×24, 99 mines)</option>
      </select>

      <button onClick={onRestart} style={{ padding: "5px 10px" }}>
        🔄 Restart
      </button>

      {difficulty === "hard" && (
        <button
          onClick={onAiHint}
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

      <div style={{ marginLeft: "20px", fontWeight: "bold" }}>
        ⏱ Time: {time}s
      </div>
    </div>
  );
}
