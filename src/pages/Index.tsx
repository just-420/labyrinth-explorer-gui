
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-200 via-blue-50 to-white flex items-center justify-center py-12">
      <div className="max-w-xl mx-auto text-center px-6">
        <h1 className="text-4xl font-extrabold text-primary mb-2 animate-fade-in">Maze Solver Bot</h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-6 animate-fade-in">
          Generate random mazes and visualize algorithmic solutions with DFS, BFS, A*, or Dijkstra's Algorithm.
        </p>
        <Link to="/maze">
          <Button className="bg-purple-500 hover:bg-primary-foreground hover:bg-purple-600 text-white px-8 py-3 rounded hover-scale mt-4 animate-scale-in text-lg font-semibold gap-2 flex items-center justify-center shadow-lg shadow-purple-200 transition"> 
            Try the Maze Solver <ArrowRight size={20} />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
