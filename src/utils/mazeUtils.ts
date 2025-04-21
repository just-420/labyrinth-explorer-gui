/**
 * Maze cell: 0=space, 1=wall.
 * Start and End: customizable via arguments.
 * Maze gen: random Prim's variant.
 * Each solver supports animated traversal.
 */

import { Algorithm, Position } from "@/pages/MazeSolver";

// Helpers
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateMaze(rows: number, cols: number): number[][] {
  // Initialize all walls
  const maze = Array.from({ length: rows }, () => Array(cols).fill(1));
  function inBounds(r: number, c: number) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
  }
  // Start at [0,0]
  maze[0][0] = 0;
  const walls: [number, number][] = [];
  for (const [dr, dc] of [
    [0, 1],
    [1, 0],
  ])
    if (inBounds(0 + dr, 0 + dc)) walls.push([0 + dr, 0 + dc]);
  while (walls.length > 0) {
    const idx = Math.floor(Math.random() * walls.length);
    const [r, c] = walls.splice(idx, 1)[0];
    if (maze[r][c] === 0) continue;
    // Check neighbors
    let openNb = 0;
    for (const [dr, dc] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const nr = r + dr,
        nc = c + dc;
      if (inBounds(nr, nc) && maze[nr][nc] === 0) openNb++;
    }
    if (openNb === 1) {
      maze[r][c] = 0;
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]) {
        const nr = r + dr,
          nc = c + dc;
        if (inBounds(nr, nc) && maze[nr][nc] === 1) walls.push([nr, nc]);
      }
    }
  }
  // Make sure [rows-1,cols-1] is open
  maze[rows - 1][cols - 1] = 0;
  return maze;
}

// Animate helper: calls setVisited as algorithm progresses
async function animateTraversal(order: { r: number; c: number }[], setVisited: (v: any) => void) {
  for (let i = 0; i < order.length; i++) {
    setVisited(order.slice(0, i + 1));
    await new Promise((res) => setTimeout(res, 7));
  }
}

export async function solveMaze(
  maze: number[][],
  algo: Algorithm,
  setVisited: (arr: { r: number; c: number }[]) => void,
  start: Position = { r: 0, c: 0 },
  end?: Position
): Promise<{ visitedOrder: { r: number; c: number }[]; finalPath: { r: number; c: number }[] }> {
  const rows = maze.length,
    cols = maze[0].length;
  const s = start;
  const e = end ?? { r: rows - 1, c: cols - 1 };
  let visitedOrder: { r: number; c: number }[] = [];
  let finalPath: { r: number; c: number }[] = [];

  if (algo === "DFS") {
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
    const order: { r: number; c: number }[] = [];
    let found = false;
    function dfs(r: number, c: number) {
      if (!inBounds(r, c) || maze[r][c] === 1 || visited[r][c]) return;
      order.push({ r, c });
      visited[r][c] = true;
      if (r === e.r && c === e.c) {
        found = true;
        return;
      }
      for (const [dr, dc] of shuffle([
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1],
      ])) {
        if (found) return;
        const nr = r + dr,
          nc = c + dc;
        if (inBounds(nr, nc) && maze[nr][nc] === 0 && !visited[nr][nc]) {
          parent[nr][nc] = [r, c];
          dfs(nr, nc);
        }
      }
    }
    function inBounds(r: number, c: number) {
      return r >= 0 && r < rows && c >= 0 && c < cols;
    }
    dfs(s.r, s.c);
    visitedOrder = order;
    await animateTraversal(order, setVisited);
    // Backtrack for path
    let path = [];
    let cur: any = [e.r, e.c];
    while (cur && !(cur[0] === s.r && cur[1] === s.c)) {
      path.push({ r: cur[0], c: cur[1] });
      cur = parent[cur[0]][cur[1]];
    }
    path.push(s);
    finalPath = path.reverse();
  } else if (algo === "BFS") {
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
    const queue: [number, number][] = [[s.r, s.c]];
    visited[s.r][s.c] = true;
    const order: { r: number; c: number }[] = [{ ...s }];
    let found = false;
    function inBounds(r: number, c: number) {
      return r >= 0 && r < rows && c >= 0 && c < cols;
    }
    while (queue.length && !found) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1],
      ]) {
        const nr = r + dr,
          nc = c + dc;
        if (inBounds(nr, nc) && maze[nr][nc] === 0 && !visited[nr][nc]) {
          queue.push([nr, nc]);
          visited[nr][nc] = true;
          parent[nr][nc] = [r, c];
          order.push({ r: nr, c: nc });
          if (nr === e.r && nc === e.c) found = true;
        }
      }
    }
    visitedOrder = order;
    await animateTraversal(order, setVisited);
    // Backtrack for path
    let path = [];
    let cur: any = [e.r, e.c];
    while (cur && !(cur[0] === s.r && cur[1] === s.c)) {
      path.push({ r: cur[0], c: cur[1] });
      cur = parent[cur[0]][cur[1]];
    }
    path.push(s);
    finalPath = path.reverse();
  } else if (algo === "A*") {
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
    const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const heap: [number, number, number][] = [[0, s.r, s.c]];
    dist[s.r][s.c] = 0;
    const order: { r: number; c: number }[] = [];
    function inBounds(r: number, c: number) {
      return r >= 0 && r < rows && c >= 0 && c < cols;
    }
    const h = (r: number, c: number) => Math.abs(e.r - r) + Math.abs(e.c - c);
    while (heap.length) {
      heap.sort((a, b) => a[0] - b[0]);
      const [, r, c] = heap.shift()!;
      if (visited[r][c]) continue;
      order.push({ r, c });
      visited[r][c] = true;
      if (r === e.r && c === e.c) break;
      for (const [dr, dc] of [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ]) {
        const nr = r + dr,
          nc = c + dc;
        if (inBounds(nr, nc) && maze[nr][nc] === 0) {
          const cost = dist[r][c] + 1;
          if (cost < dist[nr][nc]) {
            dist[nr][nc] = cost;
            parent[nr][nc] = [r, c];
            heap.push([cost + h(nr, nc), nr, nc]);
          }
        }
      }
    }
    visitedOrder = order;
    await animateTraversal(order, setVisited);
    // Backtrack for path
    let path = [];
    let cur: any = [e.r, e.c];
    while (cur && !(cur[0] === s.r && cur[1] === s.c)) {
      path.push({ r: cur[0], c: cur[1] });
      cur = parent[cur[0]][cur[1]];
    }
    path.push(s);
    finalPath = path.reverse();
  } else if (algo === "Dijkstra") {
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
    const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    dist[s.r][s.c] = 0;
    const queue: [number, number][] = [[s.r, s.c]];
    const order: { r: number; c: number }[] = [];
    function inBounds(r: number, c: number) {
      return r >= 0 && r < rows && c >= 0 && c < cols;
    }
    while (queue.length) {
      queue.sort((a, b) => dist[a[0]][a[1]] - dist[b[0]][b[1]]);
      const [r, c] = queue.shift()!;
      if (visited[r][c]) continue;
      order.push({ r, c });
      visited[r][c] = true;
      if (r === e.r && c === e.c) break;
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [-1, 0],
        [0, -1],
      ]) {
        const nr = r + dr,
          nc = c + dc;
        if (inBounds(nr, nc) && maze[nr][nc] === 0) {
          const cost = dist[r][c] + 1;
          if (cost < dist[nr][nc]) {
            dist[nr][nc] = cost;
            parent[nr][nc] = [r, c];
            queue.push([nr, nc]);
          }
        }
      }
    }
    visitedOrder = order;
    await animateTraversal(order, setVisited);
    // Backtrack for path
    let path = [];
    let cur: any = [e.r, e.c];
    while (cur && !(cur[0] === s.r && cur[1] === s.c)) {
      path.push({ r: cur[0], c: cur[1] });
      cur = parent[cur[0]][cur[1]];
    }
    path.push(s);
    finalPath = path.reverse();
  }
  return { visitedOrder, finalPath };
}
