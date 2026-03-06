
import React, { useState, useEffect } from 'react';
import { OperationCard } from './OperationCard';
import { ResultDisplay } from './ResultDisplay';
import { bubbleSortWithSteps, mergeSortWithSteps, SortStep } from '../services/arrayUtils';
import { SortVisualizer } from './SortVisualizer';
import { AnimationControls } from './AnimationControls';

type SortAlgorithm = 'bubble' | 'merge';

const SortIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
);

export const NumericSortSection: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble');
  const [result, setResult] = useState<string | null>(null);
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(c => c + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= steps.length - 1) {
      setIsPlaying(false);
      if (steps.length > 0) {
        setResult(steps[steps.length - 1].array.join(', '));
      }
    }
  }, [isPlaying, currentStep, steps, speed]);

  const handleSort = () => {
    if (!input.trim()) {
      setResult("Input is empty.");
      return;
    }
    const numbers = input
      .split(',')
      .map(item => parseInt(item.trim(), 10))
      .filter(num => !isNaN(num));

    if (numbers.length === 0) {
      setResult("No valid numbers found in input.");
      return;
    }
    if (numbers.length > 50) {
        setResult("Please enter 50 numbers or less for a better visualization experience.");
        return;
    }

    setResult(null);
    let sortSteps: SortStep[];
    if (algorithm === 'bubble') {
      sortSteps = bubbleSortWithSteps(numbers);
    } else {
      sortSteps = mergeSortWithSteps(numbers);
    }
    setSteps(sortSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    setResult(null);
  };
  
  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1 && steps.length > 0) {
        // If finished, play from start
        setCurrentStep(0);
        setIsPlaying(true);
    } else {
        setIsPlaying(!isPlaying);
    }
  };

  return (
    <OperationCard title="Number Sorting" icon={<SortIcon />}>
      <SortVisualizer step={steps[currentStep] || null} />
       {steps.length > 0 && (
        <AnimationControls
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStep + 1}
          totalSteps={steps.length}
          isFinished={!isPlaying && currentStep >= steps.length - 1}
        />
      )}
      <div>
        <label htmlFor="numericSortInput" className="block text-sm font-medium text-slate-300 mb-1">
          Enter numbers (comma-separated)
        </label>
        <input
          type="text"
          id="numericSortInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
          placeholder="e.g., 5, 2, 8, 1"
          disabled={isPlaying}
        />
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-slate-300">Algorithm:</span>
        <div className="flex items-center">
          <input
            id="bubbleSort"
            name="sort-algorithm"
            type="radio"
            checked={algorithm === 'bubble'}
            onChange={() => setAlgorithm('bubble')}
            className="h-4 w-4 text-teal-600 bg-slate-700 border-slate-500 focus:ring-teal-500"
            disabled={isPlaying}
          />
          <label htmlFor="bubbleSort" className="ml-2 block text-sm text-slate-300">
            Bubble Sort
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="mergeSort"
            name="sort-algorithm"
            type="radio"
            checked={algorithm === 'merge'}
            onChange={() => setAlgorithm('merge')}
            className="h-4 w-4 text-teal-600 bg-slate-700 border-slate-500 focus:ring-teal-500"
            disabled={isPlaying}
          />
          <label htmlFor="mergeSort" className="ml-2 block text-sm text-slate-300">
            Merge Sort
          </label>
        </div>
      </div>
      <button
        onClick={handleSort}
        disabled={isPlaying || !input.trim()}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isPlaying ? 'Sorting...' : 'Sort and Visualize'}
      </button>
      <ResultDisplay label="Final Sorted Array" result={result} />
    </OperationCard>
  );
};
