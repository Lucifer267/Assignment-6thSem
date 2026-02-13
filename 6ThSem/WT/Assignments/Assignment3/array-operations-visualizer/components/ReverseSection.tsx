
import React, { useState } from 'react';
import { OperationCard } from './OperationCard';
import { ResultDisplay } from './ResultDisplay';
import { customReverse } from '../services/arrayUtils';

const ReverseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
);


export const ReverseSection: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const handleReverse = () => {
    if (!input.trim()) {
        setResult("Input is empty.");
        return;
    }
    const array = input.split(',').map(item => item.trim()).filter(Boolean);
    const reversedArray = customReverse(array);
    setResult(reversedArray.join(', '));
  };

  return (
    <OperationCard title="Reverse Array" icon={<ReverseIcon />}>
      <div>
        <label htmlFor="reverseInput" className="block text-sm font-medium text-slate-300 mb-1">
          Enter elements (comma-separated)
        </label>
        <input
          type="text"
          id="reverseInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
          placeholder="e.g., Apple, Banana, Cherry"
        />
      </div>
      <button
        onClick={handleReverse}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
      >
        Reverse Elements
      </button>
      <ResultDisplay label="Reversed Array" result={result} />
    </OperationCard>
  );
};
