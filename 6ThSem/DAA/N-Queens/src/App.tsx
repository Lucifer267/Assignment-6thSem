import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Crown, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Position = { row: number; col: number };
type SquareState = 'empty' | 'queen' | 'checking' | 'invalid';
type BoardState = SquareState[][];

interface SolverState {
  board: BoardState;
  row: number;
  col: number;
  solutions: number;
  isFinished: boolean;
  message: string;
}

// --- Utils ---
const createEmptyBoard = (n: number): BoardState => 
  Array(n).fill(null).map(() => Array(n).fill('empty'));

const isSafe = (board: BoardState, row: number, col: number, n: number): boolean => {
  // Check row
  for (let i = 0; i < col; i++) {
    if (board[row][i] === 'queen') return false;
  }

  // Check upper diagonal
  for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
    if (board[i][j] === 'queen') return false;
  }

  // Check lower diagonal
  for (let i = row, j = col; j >= 0 && i < n; i++, j--) {
    if (board[i][j] === 'queen') return false;
  }

  return true;
};

// --- Solver Generator with proper cleanup ---
function* solveNQueens(n: number) {
  const board = createEmptyBoard(n);
  let solutions = 0;

  function* backtrack(col: number): Generator<SolverState> {
    if (col >= n) {
      solutions++;
      yield { board: structuredClone(board), row: -1, col: n, solutions, isFinished: false, message: 'Solution Found!' };
      return;
    }

    for (let row = 0; row < n; row++) {
      // Show we are checking this square
      board[row][col] = 'checking';
      yield { board: structuredClone(board), row, col, solutions, isFinished: false, message: `Checking Row ${row + 1}, Col ${col + 1}` };

      if (isSafe(board, row, col, n)) {
        board[row][col] = 'queen';
        yield { board: structuredClone(board), row, col, solutions, isFinished: false, message: `Placed Queen at (${row + 1}, ${col + 1})` };
        
        yield* backtrack(col + 1);
        
        // Backtrack
        board[row][col] = 'checking';
        yield { board: structuredClone(board), row, col, solutions, isFinished: false, message: `Backtracking from (${row + 1}, ${col + 1})` };
        board[row][col] = 'empty';
      } else {
        board[row][col] = 'invalid';
        yield { board: structuredClone(board), row, col, solutions, isFinished: false, message: `Position (${row + 1}, ${col + 1}) is Invalid` };
        board[row][col] = 'empty';
      }
    }
  }

  yield* backtrack(0);
  yield { board: structuredClone(board), row: -1, col: -1, solutions, isFinished: true, message: 'All Solutions Found!' };
}

// --- Main App ---
export default function App() {
  const [n, setN] = useState(8);
  const [speed, setSpeed] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [state, setState] = useState<SolverState>({
    board: createEmptyBoard(8),
    row: -1,
    col: -1,
    solutions: 0,
    isFinished: false,
    message: 'Press Start to begin visualization'
  });

  const [foundSolutions, setFoundSolutions] = useState<BoardState[]>([]);

  const solverRef = useRef<Generator<SolverState> | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    solverRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    setFoundSolutions([]);
    setState({
      board: createEmptyBoard(n),
      row: -1,
      col: -1,
      solutions: 0,
      isFinished: false,
      message: 'Board Reset'
    });
  }, [n]);

  const start = useCallback(() => {
    if (!isRunning) {
      solverRef.current = solveNQueens(n);
      setIsRunning(true);
      setIsPaused(false);
    } else if (isPaused) {
      setIsPaused(false);
    }
  }, [isRunning, isPaused, n]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  // Animation Loop - with proper cleanup and dependency management
  useEffect(() => {
    // Only run animation if conditions are met
    if (!isRunning || isPaused || state.isFinished || !solverRef.current) {
      // Clean up any pending timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Schedule next animation frame
    const delay = 501 - speed * 5; // Map 0-100 speed to delay
    timerRef.current = setTimeout(() => {
      if (solverRef.current) {
        const next = solverRef.current.next();
        if (!next.done) {
          setState(next.value);
        } else {
          // Animation complete - stop running
          setIsRunning(false);
        }
      }
    }, Math.max(1, delay));

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, isPaused, speed, state]);

  // Cleanup on mount/unmount and when dependencies change
  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      solverRef.current = null;
    };
  }, []);

  // Capture found solutions
  useEffect(() => {
    if (state.message === 'Solution Found!' && foundSolutions.length < state.solutions) {
      setFoundSolutions(prev => [...prev, structuredClone(state.board)]);
    }
  }, [state.solutions, state.message, foundSolutions.length, state.board]);

  // Update board when N changes
  useEffect(() => {
    reset();
  }, [n, reset]);

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      {/* Header Section */}
      <header className="h-[72px] px-10 border-b border-zinc-200 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          N-Queens Visualizer
        </h1>
        <div className="flex gap-3">
          <div className={`status-pill ${isRunning && !isPaused ? 'pill-active' : 'pill-zinc'}`}>
            <span className={`w-2 h-2 rounded-full ${isRunning && !isPaused ? 'bg-[#10b981]' : 'bg-zinc-400'}`} />
            {isRunning ? (isPaused ? 'Paused' : 'Running') : 'Idle'}
          </div>
          <div className="status-pill pill-zinc">
            Execution: {state.isFinished ? 'Finished' : 'Backtracking'}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-[320px_1fr] gap-6 p-8 md:px-10 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex flex-col gap-5 overflow-y-auto pr-2">
          {/* Configuration Card */}
          <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Configuration</h2>
            
            <div className="space-y-6">
              {/* Board Size Control */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <label className="text-zinc-700">Board Size (N)</label>
                  <span className="text-zinc-900">{n} × {n}</span>
                </div>
                <input 
                  type="range" 
                  min="4" 
                  max="12" 
                  value={n} 
                  onChange={(e) => setN(parseInt(e.target.value))}
                  disabled={isRunning}
                  className="custom-slider"
                />
              </div>

              {/* Speed Control */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <label className="text-zinc-700">Animation Speed</label>
                  <span className="text-zinc-900">{speed === 100 ? 'Turbo' : speed > 50 ? 'Fast' : 'Normal'}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={speed} 
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="custom-slider"
                />
              </div>
            </div>
          </section>

          {/* Controls Card */}
          <section className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Controls</h2>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={isRunning && !isPaused ? pause : start}
                disabled={state.isFinished}
                className={`py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                  ${(isRunning && !isPaused) 
                    ? 'bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50' 
                    : 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-sm'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRunning && !isPaused ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> {isPaused ? 'Resume' : 'Start Solving'}
                  </>
                )}
              </button>
              <button
                onClick={reset}
                className="py-2.5 px-4 bg-white border border-zinc-200 rounded-lg text-zinc-900 text-sm font-semibold hover:bg-zinc-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset Board
              </button>
            </div>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Status</div>
              <div className="text-sm font-bold text-zinc-900 truncate">
                {state.isFinished ? 'Found' : (isRunning ? 'Processing' : 'Idle')}
              </div>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Solutions</div>
              <div className="text-xl font-bold text-zinc-900">{state.solutions}</div>
            </div>
          </div>
        </aside>

        {/* Content Area with Board and Solutions */}
        <div className="flex flex-col gap-6 overflow-hidden">
          {/* Board ViewPort */}
          <div className="flex flex-col items-center justify-center bg-zinc-50/30 rounded-3xl border border-zinc-100 p-8 flex-1 overflow-hidden">
            <div className="relative p-1 bg-zinc-900 rounded-lg shadow-2xl overflow-hidden max-h-full aspect-square w-auto h-auto flex items-center justify-center">
              <div 
                className="grid gap-[1px] bg-zinc-900 h-full w-full"
                style={{ 
                  gridTemplateColumns: `repeat(${n}, 1fr)`,
                  // Limit board size while keeping it square
                  width: `min(calc(100vh - 200px), 640px)`,
                  height: `min(calc(100vh - 200px), 640px)`
                }}
              >
                {state.board.map((row, rIdx) => 
                  row.map((sq, cIdx) => (
                    <MemoizedSquare
                      key={`${rIdx}-${cIdx}`} 
                      state={sq} 
                      row={rIdx} 
                      col={cIdx} 
                      n={n}
                      isActive={rIdx === state.row && cIdx === state.col}
                    />
                  ))
                )}
              </div>
            </div>
            
            {/* Dynamic Status Log */}
            <div className="mt-8 px-6 py-2.5 bg-white border border-zinc-200 rounded-full shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-sm font-semibold text-zinc-600">
                {state.message}
              </span>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </div>
          </div>

          {/* Solutions Gallery */}
          {foundSolutions.length > 0 && (
            <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                Found Solutions ({foundSolutions.length})
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {foundSolutions.map((solution, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 p-1.5 bg-zinc-900 rounded border border-zinc-300 hover:border-zinc-400 transition-colors cursor-pointer"
                    title={`Solution ${idx + 1}`}
                  >
                    <div 
                      className="grid gap-0.5 bg-zinc-900"
                      style={{ 
                        gridTemplateColumns: `repeat(${n}, 1fr)`,
                        width: `${n * 16}px`,
                        height: `${n * 16}px`
                      }}
                    >
                      {solution.map((row, rIdx) =>
                        row.map((sq, cIdx) => (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className={`text-[6px] flex items-center justify-center border border-zinc-700 rounded-sm ${
                              sq === 'queen' ? 'bg-amber-400' : 'bg-zinc-200'
                            }`}
                          >
                            {sq === 'queen' && <span className="font-bold">♛</span>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- Subcomponents ---

interface SquareProps {
  state: SquareState;
  row: number;
  col: number;
  n: number;
  isActive: boolean;
}

function Square({ state, row, col, n, isActive }: SquareProps) {
  const isDark = (row + col) % 2 === 1;
  
  return (
    <div 
      className={`relative w-full h-full flex items-center justify-center transition-colors duration-200
        ${isDark ? 'bg-zinc-100' : 'bg-white'}
        ${state === 'checking' ? 'bg-amber-100' : ''}
        ${state === 'invalid' ? 'bg-red-100' : ''}
      `}
    >
      <AnimatePresence mode="wait">
        {state === 'queen' && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            className="z-10"
          >
            <Crown className="w-1/2 h-1/2 min-w-[12px] min-h-[12px] max-w-[40px] max-h-[40px] text-zinc-900 fill-zinc-900 opacity-90 drop-shadow-sm" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isActive && (
        <motion.div 
          layoutId={`active-${row}-${col}`}
          className="absolute inset-0 border-2 border-zinc-900 z-20 pointer-events-none"
        />
      )}
      
      {/* Coordinate Labels for accessibility/debug */}
      <span className="absolute bottom-0.5 right-1 text-[8px] text-zinc-300 pointer-events-none select-none">
        {row},{col}
      </span>
    </div>
  );
}

// Memoize Square component to prevent unnecessary re-renders
const MemoizedSquare = React.memo(Square, (prevProps, nextProps) => {
  // Return true if props are equal (no re-render), false if they differ (re-render)
  return (
    prevProps.state === nextProps.state &&
    prevProps.row === nextProps.row &&
    prevProps.col === nextProps.col &&
    prevProps.n === nextProps.n &&
    prevProps.isActive === nextProps.isActive
  );
});
