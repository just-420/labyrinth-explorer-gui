
import { Algorithm } from "@/pages/MazeSolver";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const algorithms: Algorithm[] = ["DFS", "BFS", "A*", "Dijkstra"];

interface Props {
  rows: number;
  cols: number;
  setRows: (n: number) => void;
  setCols: (n: number) => void;
  algorithm: Algorithm;
  setAlgorithm: (algo: Algorithm) => void;
  onGenerate: () => void;
  onSolve: () => void;
  isSolving: boolean;
}

export default function MazeSidebar({
  rows,
  cols,
  setRows,
  setCols,
  algorithm,
  setAlgorithm,
  onGenerate,
  onSolve,
  isSolving,
}: Props) {
  return (
    <aside className="w-72 min-h-screen bg-gradient-to-br from-purple-300 via-purple-100 to-blue-100 flex flex-col gap-8 p-6 shadow-lg border-r border-gray-200">
      <Card className="p-4 flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-2">Maze Settings</h2>
        <div>
          <Label htmlFor="rows">Rows</Label>
          <Input
            id="rows"
            type="number"
            min={4}
            max={32}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cols">Columns</Label>
          <Input
            id="cols"
            type="number"
            min={4}
            max={48}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <Button
          disabled={isSolving}
          onClick={onGenerate}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Generate Maze
        </Button>
      </Card>
      <Card className="p-4 flex flex-col gap-4">
        <h2 className="text-xl font-semibold mb-2">Solver</h2>
        <div>
          <Label>Algorithm</Label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className="w-full rounded border px-2 py-1 bg-white mt-1"
          >
            {algorithms.map((algo) => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </div>
        <Button
          onClick={onSolve}
          disabled={isSolving}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {isSolving ? "Solving..." : "Solve"}
        </Button>
      </Card>
      <div className="text-xs text-gray-500 text-center mt-auto">
        Maze Solver Bot © {new Date().getFullYear()}
      </div>
    </aside>
  );
}
