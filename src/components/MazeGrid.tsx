
import React from "react";
import type { MazeCell, Position } from "@/pages/MazeSolver";

interface Props {
  maze: MazeCell[][];
  visited: Position[];
  path: Position[];
  isSolving: boolean;
  start: Position;
  end: Position;
  onCellClick?: (r: number, c: number) => void;
  pickMode?: "start" | "end" | null;
  manualMode?: boolean;
}

const startColor = "bg-purple-400";
const endColor = "bg-blue-400";
const wallColor = "bg-gray-800";
const emptyColor = "bg-white";
const visitedColor = "bg-green-200 animate-fade-in";
const pathColor = "bg-yellow-400 animate-scale-in";
// Extra border highlight for picking
const pickBorder = "ring-2 ring-offset-2 ring-black/10";

function MazeGrid({ maze, visited, path, isSolving, start, end, onCellClick, pickMode, manualMode }: Props) {
  const rows = maze.length;
  const cols = maze[0]?.length ?? 0;

  const visitedSet = new Set(visited.map(({ r, c }) => `${r},${c}`));
  const pathSet = new Set(path.map(({ r, c }) => `${r},${c}`));

  return (
    <div
      className={`grid grid-cols-${cols} gap-0.5 rounded shadow-xl bg-purple-100 p-2 transition-all`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(18px, 1fr))`,
        maxWidth: cols * 22,
        maxHeight: rows * 22,
        borderRadius: 16,
        border: "2px solid #9b87f5",
        cursor: pickMode ? "crosshair" : manualMode ? "pointer" : "default",
      }}
    >
      {maze.map((row, r) =>
        row.map((cell, c) => {
          const key = `${r},${c}`;
          let cellCls = emptyColor;
          if (cell === 1) cellCls = wallColor;
          if (visitedSet.has(key)) cellCls = visitedColor;
          if (pathSet.has(key)) cellCls = pathColor;
          // Start and End take precedence
          if (r === start.r && c === start.c) cellCls = startColor;
          if (r === end.r && c === end.c) cellCls = endColor;

          // Manual mode: allow only open, not-wall, not-start, not-end for path
          const isPickable =
            pickMode && cell !== 1 && !(r === start.r && c === start.c) && !(r === end.r && c === end.c);

          const isManualPickable =
            manualMode &&
            cell !== 1 &&
            !(r === start.r && c === start.c) &&
            !(r === end.r && c === end.c);

          return (
            <div
              key={key}
              className={`w-5 h-5 rounded transition-all border border-gray-300 ${cellCls} ${
                isPickable ? pickBorder + " hover:scale-110 cursor-pointer" : ""
              } ${isManualPickable ? "hover:brightness-110 cursor-pointer" : ""}`}
              style={{
                boxShadow:
                  pathSet.has(key) ||
                  (r === start.r && c === start.c) ||
                  (r === end.r && c === end.c)
                    ? "0 0 8px 2px #ffd600"
                    : undefined,
              }}
              tabIndex={isPickable || isManualPickable ? 0 : -1}
              role="button"
              aria-label={`${r},${c}`}
              onClick={() => {
                if (isPickable) onCellClick?.(r, c);
                else if (isManualPickable) onCellClick?.(r, c);
              }}
              onKeyDown={(e) => {
                if ((isPickable || isManualPickable) && (e.key === "Enter" || e.key === " "))
                  onCellClick?.(r, c);
              }}
            />
          );
        })
      )}
    </div>
  );
}

export default MazeGrid;
