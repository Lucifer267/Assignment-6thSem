
import React, { useState } from 'react';
import { OperationCard } from './OperationCard';
import { ResultDisplay } from './ResultDisplay';
import { linearSearch } from '../services/arrayUtils';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

export const SearchSection: React.FC = () => {
  const [arrayInput, setArrayInput] = useState<string>('');
  const [keyInput, setKeyInput] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const handleSearch = () => {
    if (!arrayInput.trim() || !keyInput.trim()) {
        setResult("Array or search key is empty.");
        return;
    }
    const array = arrayInput.split(',').map(item => item.trim()).filter(Boolean);
    const key = keyInput.trim();
    const index = linearSearch(array, key);

    if (index !== -1) {
      setResult(`Element "${key}" found at index ${index}.`);
    } else {
      setResult(`Element "${key}" not found in the array.`);
    }
  };

  return (
    <OperationCard title="Linear Search" icon={<SearchIcon />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="searchInput" className="block text-sm font-medium text-slate-300 mb-1">
            Enter elements
          </label>
          <input
            type="text"
            id="searchInput"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            placeholder="e.g., 10, 20, 30"
          />
        </div>
        <div>
          <label htmlFor="searchKey" className="block text-sm font-medium text-slate-300 mb-1">
            Enter Key
          </label>
          <input
            type="text"
            id="searchKey"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            placeholder="e.g., 20"
          />
        </div>
      </div>
      <button
        onClick={handleSearch}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-yellow-400"
      >
        Search
      </button>
      <ResultDisplay label="Search Result" result={result} />
    </OperationCard>
  );
};
