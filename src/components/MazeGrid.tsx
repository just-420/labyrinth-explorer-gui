
import React, { useEffect, useState } from "react";

type MazeCell = 0 | 1;

interface Props {
  maze: MazeCell[][];
  visited: { r: number, c: number }[];
  path: { r: number, c: number }[];
  isSolving: boolean;
}

const startColor = "bg-purple-400";
const endColor = "bg-blue-400";
const wallColor = "bg-gray-800";
const emptyColor = "bg-white";
const visitedColor = "bg-green-200 animate-fade-in";
const pathColor = "bg-yellow-400 animate-scale-in";

function MazeGrid({ maze, visited, path, isSolving }: Props) {
  const rows = maze.length;
  const cols = maze[0]?.length ?? 0;

  // Build a set of visited/path for quick lookup
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
      }}
    >
      {maze.map((row, r) =>
        row.map((cell, c) => {
          const key = `${r},${c}`;
          let cellCls = emptyColor;
          if (cell === 1) cellCls = wallColor;
          if (visitedSet.has(key)) cellCls = visitedColor;
          if (pathSet.has(key)) cellCls = pathColor;
          if (r === 0 && c === 0) cellCls = startColor;
          if (r === rows - 1 && c === cols - 1) cellCls = endColor;
          return (
            <div
              key={key}
              className={`w-5 h-5 rounded transition-all border border-gray-300 ${cellCls}`}
              style={{
                boxShadow:
                  pathSet.has(key) || (r === 0 && c === 0) || (r === rows - 1 && c === cols - 1)
                    ? "0 0 8px 2px #ffd600"
                    : undefined,
              }}
            />
          );
        })
      )}
    </div>
  );
}

export default MazeGrid;
