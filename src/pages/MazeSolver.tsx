import MazeSidebar from "@/components/MazeSidebar";
import MazeGrid from "@/components/MazeGrid";
import { useState } from "react";
import { generateMaze, solveMaze } from "@/utils/mazeUtils";
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";

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

const algorithmDescriptions = {
  "DFS": "Depth-First Search explores as far as possible along each branch before backtracking. It works by starting at the root node and exploring as far as possible along each branch before backtracking.",
  "BFS": "Breadth-First Search explores all nodes at the present depth before moving on to nodes at the next depth level. It guarantees the shortest path in unweighted graphs.",
  "A*": "A* Search uses heuristics to find the shortest path. It combines the actual distance from start (g-score) with estimated distance to end (h-score) to make intelligent path choices.",
  "Dijkstra": "Dijkstra's Algorithm finds the shortest path by maintaining a set of unvisited nodes and continuously updating the distances to reach each node."
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
  const [visitedCount, setVisitedCount] = useState<number>(0);
  const [algorithmStats, setAlgorithmStats] = useState<{
    [key in Algorithm]?: {
      time: number;
      visitedCount: number;
      pathLength: number;
    };
  }>({});

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
    const timeElapsed = endTime - startTime;
    setSolveTime(timeElapsed);
    setVisitedCount(visitedOrder.length);
    
    setAlgorithmStats(prev => ({
      ...prev,
      [algorithm]: {
        time: timeElapsed,
        visitedCount: visitedOrder.length,
        pathLength: finalPath.length
      }
    }));
    
    setPath(finalPath);
    setIsSolving(false);

    toast({
      title: "Maze Solved!",
      description: 
        `Time: ${timeElapsed.toFixed(2)}ms\n` +
        `Cells visited: ${visitedOrder.length}\n` +
        `Path length: ${finalPath.length}\n` +
        `Time complexity: ${timeComplexities[algorithm]}`,
    });
  };

  const getBestAlgorithm = () => {
    if (Object.keys(algorithmStats).length === 0) return null;
    
    return Object.entries(algorithmStats).reduce((best, [algo, stats]) => {
      if (!best) return { algo, stats };
      return stats.visitedCount < best.stats.visitedCount ? { algo, stats } : best;
    }, null as null | { algo: string; stats: { time: number; visitedCount: number; pathLength: number } });
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
          <>
            <div className="mt-4 p-6 bg-white/50 rounded-lg shadow-md max-w-2xl mx-auto">
              <h3 className="font-semibold mb-3 text-lg">Solution Statistics</h3>
              <div className="space-y-2 text-sm">
                <p>Time taken: <span className="font-medium">{solveTime.toFixed(2)}ms</span></p>
                <p>Cells visited: <span className="font-medium">{visitedCount}</span></p>
                <p>Path length: <span className="font-medium">{path.length}</span></p>
                <p>Time Complexity: <span className="font-medium">{timeComplexities[algorithm]}</span></p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">How {algorithm} works:</h4>
                  <p className="text-gray-600 leading-relaxed">{algorithmDescriptions[algorithm]}</p>
                </div>
              </div>
            </div>

            {Object.keys(algorithmStats).length > 1 && (
              <div className="mt-4 p-6 bg-white/50 rounded-lg shadow-md max-w-2xl mx-auto w-full">
                <h3 className="font-semibold mb-3 text-lg">Algorithm Comparison</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Algorithm</TableHead>
                      <TableHead>Time (ms)</TableHead>
                      <TableHead>Cells Visited</TableHead>
                      <TableHead>Path Length</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(algorithmStats).map(([algo, stats]) => (
                      <TableRow key={algo}>
                        <TableCell>{algo}</TableCell>
                        <TableCell>{stats.time.toFixed(2)}</TableCell>
                        <TableCell>{stats.visitedCount}</TableCell>
                        <TableCell>{stats.pathLength}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {getBestAlgorithm() && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Optimal Algorithm</h4>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">{getBestAlgorithm()?.algo}</span> performed best for this maze,
                      visiting only {getBestAlgorithm()?.stats.visitedCount} cells to find a path of length {getBestAlgorithm()?.stats.pathLength}.
                      This suggests it made efficient choices in exploring the maze structure.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
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
