
import React from "react";
import { Card } from "@/components/ui/card";

export default function ERDiagram() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Maze Solver ER Diagram</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Card className="p-4 flex-1 bg-white/80 shadow-md border-2 border-blue-200">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">Maze</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>rows (number)</li>
            <li>cols (number)</li>
            <li>cells (MazeCell[][])</li>
            <li>start (Position)</li>
            <li>end (Position)</li>
          </ul>
        </Card>
        
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="w-12 h-1 md:w-1 md:h-12 bg-gray-300"></div>
          <div className="text-xs text-gray-500 mx-2">has</div>
          <div className="w-12 h-1 md:w-1 md:h-12 bg-gray-300"></div>
        </div>
        
        <Card className="p-4 flex-1 bg-white/80 shadow-md border-2 border-green-200">
          <h3 className="text-lg font-semibold mb-2 text-green-700">Cell</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>type (0 | 1)</li>
            <li>position (Position)</li>
            <li>isStart (boolean)</li>
            <li>isEnd (boolean)</li>
            <li>isVisited (boolean)</li>
            <li>isPath (boolean)</li>
          </ul>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Card className="p-4 flex-1 bg-white/80 shadow-md border-2 border-purple-200">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Algorithm</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>type ("DFS" | "BFS" | "A*" | "Dijkstra")</li>
            <li>timeComplexity (string)</li>
            <li>description (string)</li>
          </ul>
        </Card>
        
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="w-12 h-1 md:w-1 md:h-12 bg-gray-300"></div>
          <div className="text-xs text-gray-500 mx-2">solves</div>
          <div className="w-12 h-1 md:w-1 md:h-12 bg-gray-300"></div>
        </div>
        
        <Card className="p-4 flex-1 bg-white/80 shadow-md border-2 border-orange-200">
          <h3 className="text-lg font-semibold mb-2 text-orange-700">Solution</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
            <li>visitedCells (Position[])</li>
            <li>path (Position[])</li>
            <li>solveTime (number)</li>
          </ul>
        </Card>
      </div>

      <Card className="p-4 bg-white/80 shadow-md border-2 border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Position</h3>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
          <li>r (number)</li>
          <li>c (number)</li>
        </ul>
      </Card>
      
      <div className="mt-6 text-sm text-gray-600">
        <p className="font-semibold">Entity Relationships:</p>
        <ul className="list-disc list-inside mt-2">
          <li>A Maze contains many Cells organized in a grid</li>
          <li>An Algorithm generates a Solution for a Maze</li>
          <li>A Solution contains a set of Positions representing the path and visited cells</li>
          <li>Each Cell has a Position in the Maze</li>
        </ul>
      </div>
    </div>
  );
}
