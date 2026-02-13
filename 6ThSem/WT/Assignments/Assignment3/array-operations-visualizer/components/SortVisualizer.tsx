
import React from 'react';
import { SortStep } from '../services/arrayUtils';

interface SortVisualizerProps {
  step: SortStep | null;
}

export const SortVisualizer: React.FC<SortVisualizerProps> = ({ step }) => {
  if (!step) {
    return (
      <div className="flex justify-center items-center bg-slate-900/70 rounded-md border border-slate-700 h-64">
        <p className="text-slate-400">Enter numbers and click Sort to visualize.</p>
      </div>
    );
  }

  const { array, highlight, sorted } = step;
  const maxValue = Math.max(...array, 1); // Avoid division by zero

  return (
    <div className="flex justify-center items-end bg-slate-900/70 rounded-md border border-slate-700 p-4 h-64 space-x-1" aria-live="polite">
      {array.map((value, index) => {
        const height = `${Math.max((value / maxValue) * 100, 5)}%`; // min height of 5%
        let bgColor = 'bg-slate-500'; // Default
        
        if (sorted.includes(index)) {
          bgColor = 'bg-green-500'; // Sorted
        }
        if (highlight.includes(index)) {
          bgColor = 'bg-red-500'; // Being compared/swapped
        }
        
        const isHighlighted = highlight.includes(index);
        const barClasses = `
          h-full w-full 
          ${bgColor} 
          rounded-t-sm 
          flex items-end justify-center 
          transition-all duration-300 ease-in-out
          ${isHighlighted ? 'opacity-100' : 'opacity-75'}
        `;

        return (
          <div
            key={index}
            className="flex-grow flex flex-col justify-end items-center"
            style={{ height: '100%' }}
            title={`Value: ${value}`}
          >
            <div className="h-full w-full transition-all duration-300 ease-in-out" style={{height, transitionProperty: 'height'}}>
              <div
                className={barClasses}
              />
            </div>
            {array.length <= 25 && <span className="text-xs text-slate-400 mt-1">{value}</span>}
          </div>
        );
      })}
    </div>
  );
};
