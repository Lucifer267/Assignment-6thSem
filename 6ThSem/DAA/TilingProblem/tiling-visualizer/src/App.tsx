import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Square, MousePointer2, Settings2, Info } from 'lucide-react';

// Types
type Coordinate = { r: number; c: number };
type Tromino = {
  id: number;
  color: string;
  cells: Coordinate[];
};
type BoardState = number[][]; // 0 = empty, -1 = missing, >0 = tromino ID

// Constants
// Removed fixed COLORS array in favor of generative colors

export default function App() {
  // State
  const [n, setN] = useState<number>(3);
  const [boardSize, setBoardSize] = useState<number>(8);
  const [missingTile, setMissingTile] = useState<Coordinate | null>(null);
  const [board, setBoard] = useState<BoardState>([]);
  const [isTiling, setIsTiling] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(100); // ms delay
  const [steps, setSteps] = useState<Tromino[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [trominoCount, setTrominoCount] = useState<number>(0);

  // Refs for animation loop
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to generate distinct colors using Golden Angle approximation
  const generateColor = (id: number) => {
    // Use the golden angle (approx 137.5 degrees) to distribute hues evenly
    const hue = (id * 137.508) % 360;
    // Vary saturation and lightness slightly to add more distinction
    const saturation = 65 + (id % 20); // 65-85%
    const lightness = 45 + (id % 15);  // 45-60%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Initialize board
  useEffect(() => {
    const size = Math.pow(2, n);
    setBoardSize(size);
    resetBoard(size);
  }, [n]);

  const resetBoard = (size: number) => {
    const newBoard = Array(size).fill(0).map(() => Array(size).fill(0));
    setBoard(newBoard);
    setMissingTile(null);
    setIsTiling(false);
    setIsFinished(false);
    setSteps([]);
    setCurrentStepIndex(0);
    setTrominoCount(0);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleTileClick = (r: number, c: number) => {
    if (isTiling || isFinished || missingTile) return;
    
    setMissingTile({ r, c });
    setBoard((prev: BoardState) => {
      const newBoard = prev.map((row: number[]) => [...row]);
      newBoard[r][c] = -1; // Mark as missing
      return newBoard;
    });
  };

  const generateSteps = () => {
    if (!missingTile) return;

    const moves: Tromino[] = [];
    let trominoIdCounter = 1;

    const solve = (
      size: number,
      topRow: number,
      topCol: number,
      missR: number,
      missC: number
    ) => {
      if (size === 2) {
        // Base case: 2x2 board
        const cells: Coordinate[] = [];
        // Check all 4 cells in this 2x2 block
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            const r = topRow + i;
            const c = topCol + j;
            if (r !== missR || c !== missC) {
              cells.push({ r, c });
            }
          }
        }
        moves.push({
          id: trominoIdCounter,
          color: generateColor(trominoIdCounter),
          cells
        });
        trominoIdCounter++;
        return;
      }

      const half = size / 2;
      const centerR = topRow + half;
      const centerC = topCol + half;

      // Define the 4 quadrants' missing tiles (initially center)
      let topLeftMiss = { r: centerR - 1, c: centerC - 1 };
      let topRightMiss = { r: centerR - 1, c: centerC };
      let bottomLeftMiss = { r: centerR, c: centerC - 1 };
      let bottomRightMiss = { r: centerR, c: centerC };

      // Determine which quadrant contains the actual missing tile
      // and update that quadrant's missing tile to be the real one.
      // The other 3 quadrants will have their "missing tile" be the corner at the center.
      
      // Top Left
      if (missR < centerR && missC < centerC) {
        topLeftMiss = { r: missR, c: missC };
      }
      // Top Right
      else if (missR < centerR && missC >= centerC) {
        topRightMiss = { r: missR, c: missC };
      }
      // Bottom Left
      else if (missR >= centerR && missC < centerC) {
        bottomLeftMiss = { r: missR, c: missC };
      }
      // Bottom Right
      else {
        bottomRightMiss = { r: missR, c: missC };
      }

      // Place the central tromino (covering the 3 corners that are NOT the real missing quadrant)
      const centerTrominoCells: Coordinate[] = [];
      if (missR >= centerR || missC >= centerC) centerTrominoCells.push({ r: centerR - 1, c: centerC - 1 }); // TL
      if (missR >= centerR || missC < centerC) centerTrominoCells.push({ r: centerR - 1, c: centerC });     // TR
      if (missR < centerR || missC >= centerC) centerTrominoCells.push({ r: centerR, c: centerC - 1 });     // BL
      if (missR < centerR || missC < centerC) centerTrominoCells.push({ r: centerR, c: centerC });          // BR

      moves.push({
        id: trominoIdCounter,
        color: generateColor(trominoIdCounter),
        cells: centerTrominoCells
      });
      trominoIdCounter++;

      // Recurse
      solve(half, topRow, topCol, topLeftMiss.r, topLeftMiss.c);
      solve(half, topRow, centerC, topRightMiss.r, topRightMiss.c);
      solve(half, centerR, topCol, bottomLeftMiss.r, bottomLeftMiss.c);
      solve(half, centerR, centerC, bottomRightMiss.r, bottomRightMiss.c);
    };

    solve(boardSize, 0, 0, missingTile.r, missingTile.c);
    return moves;
  };

  const startTiling = () => {
    if (!missingTile) return;
    
    const calculatedSteps = generateSteps();
    if (calculatedSteps) {
      // Pre-fill color map to avoid render flickering
      const newColorMap = new Map<number, string>();
      calculatedSteps.forEach(step => {
        newColorMap.set(step.id, step.color);
      });
      colorMapRef.current = newColorMap;

      setSteps(calculatedSteps);
      setIsTiling(true);
      setCurrentStepIndex(0);
    }
  };

  // Animation Loop
  useEffect(() => {
    if (isTiling && currentStepIndex < steps.length) {
      timeoutRef.current = setTimeout(() => {
        const step = steps[currentStepIndex];
        
        setBoard((prev: BoardState) => {
          const newBoard = prev.map((row: number[]) => [...row]);
          step.cells.forEach((cell: Coordinate) => {
            newBoard[cell.r][cell.c] = step.id;
          });
          return newBoard;
        });
        
        setTrominoCount((prev: number) => prev + 1);
        setCurrentStepIndex((prev: number) => prev + 1);

      }, speed);
    } else if (isTiling && currentStepIndex >= steps.length) {
      setIsTiling(false);
      setIsFinished(true);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isTiling, currentStepIndex, steps, speed]);

  const colorMapRef = useRef<Map<number, string>>(new Map());

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex flex-col gap-6 shadow-sm z-10 h-screen overflow-hidden">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <Square className="w-6 h-6 fill-indigo-600 text-indigo-600" />
            Tromino Tiling
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Divide & Conquer Visualization
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Grid Size (2ⁿ)</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="6" 
                value={n} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (!isTiling) setN(parseInt(e.target.value));
                }}
                disabled={isTiling}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="font-mono font-bold w-12 text-right">2^{n}</span>
            </div>
            <p className="text-xs text-gray-400">
              Board Size: {boardSize} × {boardSize} ({boardSize * boardSize} tiles)
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Animation Speed</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="500" 
                step="10"
                value={501 - speed} // Invert so right is faster
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpeed(501 - parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xs font-medium w-12 text-right">
                {speed < 50 ? 'Fast' : speed > 200 ? 'Slow' : 'Normal'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          {!missingTile ? (
            <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start gap-2">
              <MousePointer2 className="w-4 h-4 mt-0.5 shrink-0" />
              Click any square on the grid to mark the missing tile.
            </div>
          ) : (
            <button
              onClick={startTiling}
              disabled={isTiling || isFinished}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                isTiling || isFinished
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              Start Tiling
            </button>
          )}

          <button
            onClick={() => resetBoard(boardSize)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Board
          </button>
        </div>

        <div className="space-y-3 pt-6 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Trominoes Placed</span>
            <span className="font-mono font-bold">{trominoCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-mono font-bold">
              {steps.length > 0 ? Math.round((currentStepIndex / steps.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Recent Steps Log */}
        <div className="flex-1 min-h-[200px] bg-gray-50 rounded-lg p-3 overflow-y-auto text-xs font-mono border border-gray-200 flex flex-col">
          <div className="text-gray-400 mb-2 font-sans font-medium text-xs uppercase tracking-wider sticky top-0 bg-gray-50">Activity Log</div>
          <div className="flex-1 overflow-y-auto">
            {steps.slice(0, currentStepIndex).reverse().map((step) => (
              <div key={step.id} className="mb-1 text-gray-600 py-1 px-1 hover:bg-gray-100 rounded">
                <span className="text-indigo-600 font-bold">#{step.id}</span>: Placed at {step.cells.map(c => `(${c.r},${c.c})`).join(' ')}
              </div>
            ))}
            {currentStepIndex === 0 && <div className="text-gray-400 italic">Ready to start...</div>}
          </div>
        </div>
      </div>

      {/* Main Board Area */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-10 overflow-auto bg-gray-50">
        <div 
          className="relative bg-white shadow-xl rounded-lg border border-gray-200 p-1 transition-all duration-300"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
            width: 'min(90vw, 90vh)',
            aspectRatio: '1/1',
            gap: '1px',
            backgroundColor: '#e5e7eb' // Grid line color
          }}
        >
          {board.map((row, r) => (
            row.map((val, c) => {
              const isMissing = val === -1;
              const isEmpty = val === 0;
              const color = !isEmpty && !isMissing ? colorMapRef.current.get(val) : undefined;
              
              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => handleTileClick(r, c)}
                  className={`
                    relative transition-colors duration-200
                    ${isEmpty ? 'bg-white hover:bg-gray-50 cursor-pointer' : ''}
                    ${isMissing ? 'bg-black' : ''}
                  `}
                  style={{
                    backgroundColor: color,
                  }}
                >
                  {/* Optional: Debug coordinates */}
                  {/* <span className="absolute top-0 left-0 text-[8px] text-gray-300">{r},{c}</span> */}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
}
