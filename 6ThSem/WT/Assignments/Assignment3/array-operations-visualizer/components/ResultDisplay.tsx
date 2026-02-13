
import React from 'react';

interface ResultDisplayProps {
  label: string;
  result: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ label, result }) => {
  if (result === null) return null;

  return (
    <div>
      <h3 className="text-sm font-medium text-slate-400">{label}</h3>
      <div className="mt-1 p-3 bg-slate-900/70 rounded-md border border-slate-700 min-h-[44px]">
        <p className="text-teal-300 font-mono break-words">{result}</p>
      </div>
    </div>
  );
};
