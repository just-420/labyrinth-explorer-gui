import MazeSidebar from "@/components/MazeSidebar";
import MazeGrid from "@/components/MazeGrid";
import { useState } from "react";
import { generateMaze, solveMaze } from "@/utils/mazeUtils";
import { toast } from "@/hooks/use-toast";

export type Algorithm = "DFS" | "BFS" | "A*" | "Dijkstra";

export type MazeCell = 0 | 1;
export type Position = { r: number; c: number };

const DEFAULT_ROWS = 16;
const DEFAULT_COLS = 24;

const timeComplexities = {
  "DFS": "O(V + E) - where V is the number of vertices (cells) and E is the number of edges",
  "BFS": "O(V + E) - where V is the number of vertices (cells) and E is the number of edges",
  "A*": "O(b^d) - where b is the branching factor and d is the depth of the solution",
  "Dijkstra": "O((V + E) * log V) - where V is the number of vertices and E is the number of edges"
};

const MazeSolver = () => {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [maze, setMaze] = useState<MazeCell[][]>(() => generateMaze(DEFAULT_ROWS, DEFAULT_COLS) as MazeCell[][]);
  const [algorithm, setAlgorithm] = useState<Algorithm>("DFS");
  const [isSolving, setIsSolving] = useState(false);
  const [visited, setVisited] = useState<Position[]>([]);
  const [path, setPath] = useState<Position[]>([]);
  const [start, setStart] = useState<Position>({ r: 0, c: 0 });
  const [end, setEnd] = useState<Position>({ r: DEFAULT_ROWS - 1, c: DEFAULT_COLS - 1 });
  const [pickMode, setPickMode] = useState<null | "start" | "end">(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualPath, setManualPath] = useState<Position[]>([]);
  const [solveTime, setSolveTime] = useState<number>(0);

  const handleGenerate = () => {
    const newMaze = generateMaze(rows, cols) as MazeCell[][];
    setMaze(newMaze);
    setVisited([]);
    setPath([]);
    setStart({ r: 0, c: 0 });
    setEnd({ r: rows - 1, c: cols - 1 });
    setPickMode(null);
    setManualMode(true);
    setManualPath([ { r: 0, c: 0 } ]);
  };

  const handleStartManual = () => {
    setManualMode(true);
    setPath([]);
    setVisited([]);
    setManualPath([start]);
  };

  const handleFinishManual = () => {
    setManualMode(false);
    setVisited([]);
    setPath([]);
  };

  const handleCellClick = (r: number, c: number) => {
    if (isSolving) return;
    if (maze[r][c] === 1) return;
    if (pickMode === "start") {
      setStart({ r, c });
      setPickMode(null);
      setVisited([]);
      setPath([]);
      setManualPath([ { r, c } ]);
      return;
    }
    if (pickMode === "end") {
      setEnd({ r, c });
      setPickMode(null);
      setVisited([]);
      setPath([]);
      return;
    }
    if (manualMode) {
      const last = manualPath[manualPath.length - 1];
      const isNeighbor = Math.abs(last.r - r) + Math.abs(last.c - c) === 1;
      if (!isNeighbor) return;
      if (manualPath.some(pos => pos.r === r && pos.c === c)) return;
      setManualPath([...manualPath, { r, c }]);
    }
  };

  const handleSolve = async () => {
    if (manualMode) return;
    setIsSolving(true);
    setVisited([]);
    setPath([]);
    
    const startTime = performance.now();
    const { visitedOrder, finalPath } = await solveMaze(maze, algorithm, setVisited, start, end);
    const endTime = performance.now();
    setSolveTime(endTime - startTime);
    
    setPath(finalPath);
    setIsSolving(false);

    toast({
      title: "Maze Solved!",
      description: `Time taken: ${(endTime - startTime).toFixed(2)}ms\n${timeComplexities[algorithm]}`,
    });
  };

  const userSolved = manualPath.length > 0 &&
    manualPath[0].r === start.r &&
    manualPath[0].c === start.c &&
    manualPath[manualPath.length - 1].r === end.r &&
    manualPath[manualPath.length - 1].c === end.c;

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
          {!manualMode && (
            <button
              className="text-sm px-3 py-1.5 rounded bg-yellow-300 hover:bg-yellow-400 font-semibold border ml-6"
              onClick={handleStartManual}
              disabled={isSolving}
            >
              Try to solve yourself!
            </button>
          )}
        </div>
        {manualMode && (
          <div className="flex gap-3 mb-2">
            <span className="text-xs text-green-700 font-semibold">
              {userSolved
                ? "Congrats! You reached the end! 🔥"
                : "Click cells to build your path from Start to End."}
            </span>
            <button
              className={`text-xs px-2 py-1 rounded ${userSolved ? "bg-green-400 hover:bg-green-500" : "bg-gray-200"}`}
              disabled={!userSolved}
              onClick={handleFinishManual}
            >
              Finish Manual Attempt
            </button>
            <button
              className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-300"
              onClick={() => setManualPath([start])}
            >
              Reset Path
            </button>
            <button
              className="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-300"
              onClick={() => {
                setManualMode(false);
                handleSolve();
              }}
            >
              Use Algorithm to Solve
            </button>
          </div>
        )}
        <MazeGrid
          maze={maze}
          visited={visited}
          path={manualMode ? manualPath : path}
          isSolving={isSolving}
          start={start}
          end={end}
          onCellClick={handleCellClick}
          pickMode={pickMode}
          manualMode={manualMode}
        />
        
        {solveTime > 0 && !manualMode && (
          <div className="mt-4 p-4 bg-white/50 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Solution Statistics</h3>
            <p className="text-sm">Time taken: {solveTime.toFixed(2)}ms</p>
            <p className="text-sm text-gray-600 mt-1">Time Complexity: {timeComplexities[algorithm]}</p>
          </div>
        )}

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
