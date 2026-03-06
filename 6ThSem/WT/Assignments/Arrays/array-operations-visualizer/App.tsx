
import React from 'react';
import { ReverseSection } from './components/ReverseSection';
import { SearchSection } from './components/SearchSection';
import { NumericSortSection } from './components/NumericSortSection';
import { StringSortSection } from './components/StringSortSection';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
            Array Operations Visualizer
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Interactively perform sorting, searching, and reversing on your own arrays without using built-in methods.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <SearchSection />
            <ReverseSection />
          </div>
          <div className="flex flex-col gap-8">
            <NumericSortSection />
            <StringSortSection />
          </div>
        </main>
        
        <footer className="text-center mt-12 text-slate-500">
            <p>Built with React, TypeScript, and Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
