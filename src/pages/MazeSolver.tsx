
import MazeSidebar from "@/components/MazeSidebar";
import MazeGrid from "@/components/MazeGrid";
import { useState } from "react";
import { generateMaze, solveMaze } from "@/utils/mazeUtils";

export type Algorithm = "DFS" | "BFS" | "A*" | "Dijkstra";

const DEFAULT_ROWS = 16;
const DEFAULT_COLS = 24;

const MazeSolver = () => {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [maze, setMaze] = useState(() => generateMaze(DEFAULT_ROWS, DEFAULT_COLS));
  const [algorithm, setAlgorithm] = useState<Algorithm>("DFS");
  const [isSolving, setIsSolving] = useState(false);
  const [visited, setVisited] = useState<{ r: number; c: number }[]>([]);
  const [path, setPath] = useState<{ r: number; c: number }[]>([]);

  const handleGenerate = () => {
    setMaze(generateMaze(rows, cols));
    setVisited([]);
    setPath([]);
  };

  const handleSolve = async () => {
    setIsSolving(true);
    setVisited([]);
    setPath([]);
    const { visitedOrder, finalPath } = await solveMaze(maze, algorithm, setVisited);
    setPath(finalPath);
    setIsSolving(false);
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
        <MazeGrid
          maze={maze}
          visited={visited}
          path={path}
          isSolving={isSolving}
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
