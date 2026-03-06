
import React from 'react';

interface AnimationControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentStep: number;
  totalSteps: number;
  isFinished: boolean;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  onPlayPause,
  onReset,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
  isFinished,
}) => {
  const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const ResetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" />
      <path strokeLinecap="round"strokeLinejoin="round" strokeWidth={2} d="M4 9a9 9 0 0114.13-5.23M20 15a9 9 0 01-14.13 5.23" />
    </svg>
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-2">
        <button onClick={onPlayPause} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={onReset} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
          <ResetIcon />
        </button>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="speed-slider" className="text-sm text-slate-400 whitespace-nowrap">Slow</label>
        <input
          id="speed-slider"
          type="range"
          min="50"
          max="1000"
          step="50"
          value={1050 - speed} // Invert so right is faster
          onChange={(e) => onSpeedChange(1050 - Number(e.target.value))}
          className="w-full sm:w-32 cursor-pointer"
        />
         <label htmlFor="speed-slider" className="text-sm text-slate-400 whitespace-nowrap">Fast</label>
      </div>
      <div className="text-sm font-mono text-slate-400 bg-slate-700 px-3 py-1 rounded-md">
        Step: {currentStep} / {totalSteps}
      </div>
    </div>
  );
};
