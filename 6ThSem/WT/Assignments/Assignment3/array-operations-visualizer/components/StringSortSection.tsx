
import React, { useState } from 'react';
import { OperationCard } from './OperationCard';
import { ResultDisplay } from './ResultDisplay';
import { stringBubbleSort } from '../services/arrayUtils';

const StringSortIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
    </svg>
);


export const StringSortSection: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const handleSort = () => {
    if (!input.trim()) {
        setResult("Input is empty.");
        return;
    }
    const array = input.split(',').map(item => item.trim()).filter(Boolean);
    const sortedArray = stringBubbleSort(array);
    setResult(sortedArray.join(', '));
  };

  return (
    <OperationCard title="Named Entity Sorting" icon={<StringSortIcon />}>
      <div>
        <label htmlFor="stringSortInput" className="block text-sm font-medium text-slate-300 mb-1">
          Enter named entities (comma-separated)
        </label>
        <input
          type="text"
          id="stringSortInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
          placeholder="e.g., Zebra, Lion, Tiger"
        />
      </div>
      <button
        onClick={handleSort}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-green-500"
      >
        Sort
      </button>
      <ResultDisplay label="Sorted Entities" result={result} />
    </OperationCard>
  );
};
