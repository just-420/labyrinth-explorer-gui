
import MazeSidebar from "@/components/MazeSidebar";
import MazeGrid from "@/components/MazeGrid";
import { useState } from "react";
import { generateMaze, solveMaze } from "@/utils/mazeUtils";

export type Algorithm = "DFS" | "BFS" | "A*" | "Dijkstra";

export type MazeCell = 0 | 1;
export type Position = { r: number; c: number };

const DEFAULT_ROWS = 16;
const DEFAULT_COLS = 24;

const MazeSolver = () => {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [maze, setMaze] = useState<MazeCell[][]>(() => generateMaze(DEFAULT_ROWS, DEFAULT_COLS) as MazeCell[][]);
  const [algorithm, setAlgorithm] = useState<Algorithm>("DFS");
  const [isSolving, setIsSolving] = useState(false);
  const [visited, setVisited] = useState<Position[]>([]);
  const [path, setPath] = useState<Position[]>([]);
  // Start and End positions, default to corners
  const [start, setStart] = useState<Position>({ r: 0, c: 0 });
  const [end, setEnd] = useState<Position>({ r: DEFAULT_ROWS - 1, c: DEFAULT_COLS - 1 });
  // Mode for picking
  const [pickMode, setPickMode] = useState<null | "start" | "end">(null);

  const handleGenerate = () => {
    const newMaze = generateMaze(rows, cols) as MazeCell[][];
    setMaze(newMaze);
    setVisited([]);
    setPath([]);
    setStart({ r: 0, c: 0 });
    setEnd({ r: rows - 1, c: cols - 1 });
  };

  const handleSolve = async () => {
    setIsSolving(true);
    setVisited([]);
    setPath([]);
    // Pass start/end to solver
    const { visitedOrder, finalPath } = await solveMaze(maze, algorithm, setVisited, start, end);
    setPath(finalPath);
    setIsSolving(false);
  };

  // Handler for grid clicks, picks start/end if in pickMode
  const handleCellClick = (r: number, c: number) => {
    if (isSolving) return;
    // Cannot pick wall
    if (maze[r][c] === 1) return;
    if (pickMode === "start") {
      setStart({ r, c });
      setPickMode(null);
      setVisited([]);
      setPath([]);
    }
    if (pickMode === "end") {
      setEnd({ r, c });
      setPickMode(null);
      setVisited([]);
      setPath([]);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-purple-100 via-blue-50 to-white">
      <MazeSidebar
        rows={rows}
        cols={cols}
        setRows={setRows}
        setCols={setCols}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        onGenerate={handleGenerate}
        onSolve={handleSolve}
        isSolving={isSolving}
      />
      <main className="w-full flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-4 text-primary">Maze Solver Bot</h1>
        <div className="flex gap-4 mb-4">
          <button
            className={`text-sm px-3 py-1.5 rounded transition ${pickMode === "start" ? "bg-purple-300" : "bg-gray-200 hover:bg-purple-100"} font-semibold`}
            onClick={() => setPickMode(pickMode === "start" ? null : "start")}
            disabled={isSolving}
          >
            {pickMode === "start" ? "Click a cell..." : "Pick Start"}
          </button>
          <button
            className={`text-sm px-3 py-1.5 rounded transition ${pickMode === "end" ? "bg-blue-200" : "bg-gray-200 hover:bg-blue-100"} font-semibold`}
            onClick={() => setPickMode(pickMode === "end" ? null : "end")}
            disabled={isSolving}
          >
            {pickMode === "end" ? "Click a cell..." : "Pick End"}
          </button>
        </div>
        <MazeGrid
          maze={maze}
          visited={visited}
          path={path}
          isSolving={isSolving}
          start={start}
          end={end}
          onCellClick={handleCellClick}
          pickMode={pickMode}
        />
        <div className="flex mt-6 gap-4 text-sm justify-center items-center">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-purple-400 border"></span> Start
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-blue-400 border"></span> End
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-gray-800 border"></span> Wall
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-green-200 border"></span> Visited
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-yellow-400 border"></span> Path
          </div>
        </div>
      </main>
    </div>
  );
};

export default MazeSolver;

