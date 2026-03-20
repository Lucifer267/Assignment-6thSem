import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, SortAsc, SortDesc, Plus, Trash2, 
  RefreshCcw, Play, Pause, Info, AlertCircle, CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface Entity {
  id: string;
  name: string;
}

type SortMethod = 'selection' | 'insertion';

export default function App() {
  // --- Integer Array State ---
  const [integers, setIntegers] = useState<number[]>([45, 12, 89, 34, 67, 23, 56, 90, 11, 78, 43, 21, 65, 32, 9, 54, 87, 18, 76, 39]);
  const [intSearch, setIntSearch] = useState('');
  const [newInt, setNewInt] = useState('');
  const [isSorting, setIsSorting] = useState(false);
  const [comparingIdx, setComparingIdx] = useState<number[]>([]);
  const [swappingIdx, setSwappingIdx] = useState<number[]>([]);
  const [sortedIdx, setSortedIdx] = useState<number[]>([]);
  const [sortMethod, setSortMethod] = useState<SortMethod>('selection');
  const [searchResult, setSearchResult] = useState<null | 'found' | 'not-found'>(null);
  const sortingRef = useRef<boolean>(false);

  // --- Named Entity State ---
  const [entities, setEntities] = useState<Entity[]>([
    { id: '1', name: 'Alice Johnson' },
    { id: '2', name: 'Global Tech Corp' },
    { id: '3', name: 'San Francisco' },
    { id: '4', name: 'React.js' },
    { id: '5', name: 'Edward Norton' },
    { id: '6', name: 'OpenAI' },
  ]);
  const [entitySearch, setEntitySearch] = useState('');
  const [newEntity, setNewEntity] = useState('');

  // --- Integer Logic & Visualization ---
  const filteredIntegers = useMemo(() => {
    if (!intSearch) return integers;
    return integers.filter(n => n.toString().includes(intSearch));
  }, [integers, intSearch]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const selectionSort = async (arr: number[]) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (!sortingRef.current) return;
        setComparingIdx([minIdx, j]);
        await sleep(100);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
        setComparingIdx([]);
      }
      if (minIdx !== i) {
        setSwappingIdx([i, minIdx]);
        await sleep(200);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setIntegers([...arr]);
        await sleep(200);
        setSwappingIdx([]);
      }
      setSortedIdx(prev => [...prev, i]);
    }
    setSortedIdx(arr.map((_, i) => i));
  };

  const insertionSort = async (arr: number[]) => {
    const n = arr.length;
    setSortedIdx([0]);
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      setComparingIdx([i]);
      await sleep(200);
      while (j >= 0 && arr[j] > key) {
        if (!sortingRef.current) return;
        setComparingIdx([j, j + 1]);
        setSwappingIdx([j, j + 1]);
        await sleep(100);
        arr[j + 1] = arr[j];
        setIntegers([...arr]);
        j = j - 1;
        await sleep(100);
        setSwappingIdx([]);
      }
      arr[j + 1] = key;
      setIntegers([...arr]);
      setSortedIdx(arr.map((_, idx) => idx <= i ? idx : -1).filter(idx => idx !== -1));
      setComparingIdx([]);
      await sleep(200);
    }
    setSortedIdx(arr.map((_, i) => i));
  };

  const startSorting = async () => {
    if (isSorting) return;
    setIsSorting(true);
    sortingRef.current = true;
    setSortedIdx([]);
    
    const arr = [...integers];
    if (sortMethod === 'selection') await selectionSort(arr);
    else if (sortMethod === 'insertion') await insertionSort(arr);
    
    setIsSorting(false);
    sortingRef.current = false;
    setComparingIdx([]);
    setSwappingIdx([]);
  };

  const stopSorting = () => {
    sortingRef.current = false;
    setIsSorting(false);
    setComparingIdx([]);
    setSwappingIdx([]);
  };

  const addInteger = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newInt);
    if (!isNaN(val) && !isSorting) {
      setIntegers([...integers, val]);
      setNewInt('');
    }
  };

  const removeInteger = (index: number) => {
    if (isSorting) return;
    setIntegers(integers.filter((_, i) => i !== index));
  };

  const resetIntegers = () => {
    if (isSorting) stopSorting();
    setIntegers([45, 12, 89, 34, 67, 23, 56, 90, 11, 78, 43, 21, 65, 32, 9, 54, 87, 18, 76, 39]);
    setSortedIdx([]);
    setSearchResult(null);
  };

  const handleSearch = () => {
    if (!intSearch.trim()) return;
    const val = parseInt(intSearch);
    if (isNaN(val)) return;
    
    const found = integers.includes(val);
    setSearchResult(found ? 'found' : 'not-found');
  };

  // --- Entity Logic ---
  const filteredEntities = useMemo(() => {
    if (!entitySearch) return entities;
    const term = entitySearch.toLowerCase();
    return entities.filter(e => e.name.toLowerCase().includes(term));
  }, [entities, entitySearch]);

  const sortEntities = (direction: 'asc' | 'desc') => {
    const sorted = [...entities].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (direction === 'asc') return nameA < nameB ? -1 : 1;
      return nameA > nameB ? -1 : 1;
    });
    setEntities(sorted);
  };

  const addEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntity.trim()) {
      const id = Math.random().toString(36).substr(2, 9);
      setEntities([...entities, { id, name: newEntity.trim() }]);
      setNewEntity('');
    }
  };

  const removeEntity = (id: string) => {
    setEntities(entities.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#1A1C1E] font-sans selection:bg-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8 space-y-16">
        
        {/* Hero Section */}
        <header className="max-w-3xl space-y-6">
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
            Array <span className="text-indigo-600">Dynamics</span> & Visual Logic.
          </h1>
          <p className="text-lg text-zinc-500 font-medium leading-relaxed">
            Explore how data moves. Watch multiple sorting algorithms in real-time with graph visualizations and manage simple name lists.
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Section A: Integer Visualization (Graph Lab) */}
          <div className="xl:col-span-7 space-y-8">
            <section className="bg-white rounded-[32px] border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-mono text-lg">01</div>
                    Graph Lab
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Algorithm Visualization</p>
                </div>
                <button 
                  onClick={resetIntegers}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-900"
                  title="Reset Array"
                >
                  <RefreshCcw className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* Visualizer Stage - Graph Focus */}
                <div className="relative h-64 flex items-end justify-center gap-1 px-2 border-b border-zinc-100 pb-4">
                  <AnimatePresence mode="popLayout">
                    {integers.map((num, idx) => {
                      const isComparing = comparingIdx.includes(idx);
                      const isSwapping = swappingIdx.includes(idx);
                      const isSorted = sortedIdx.includes(idx);
                      const height = (num / Math.max(...integers, 100)) * 100;
                      
                      return (
                        <motion.div
                          key={`${num}-${idx}`}
                          layout
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ 
                            opacity: 1, 
                            scaleY: 1,
                            transition: { type: 'spring', stiffness: 300, damping: 30 }
                          }}
                          className="relative flex flex-col items-center justify-end group flex-1"
                          style={{ height: '100%' }}
                        >
                          {/* Number Label */}
                          <div className={`mb-1 font-mono text-[10px] font-bold transition-colors duration-200 ${
                            isSwapping ? 'text-red-600' : 
                            isComparing ? 'text-indigo-600' : 
                            isSorted ? 'text-emerald-600' : 
                            'text-black'
                          }`}>
                            {num}
                          </div>
                          
                          <div 
                            className={`w-full rounded-t-sm transition-all duration-200 shadow-sm ${
                              isSwapping ? 'bg-red-500 shadow-red-200' : 
                              isComparing ? 'bg-indigo-500 shadow-indigo-200' : 
                              isSorted ? 'bg-emerald-500 shadow-emerald-200' :
                              'bg-zinc-200 group-hover:bg-zinc-300'
                            }`}
                            style={{ height: `${Math.max(height * 0.8, 5)}%` }}
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Controls Area */}
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Dropdown for Sort Method */}
                    <div className="relative flex-1">
                      <select 
                        value={sortMethod}
                        onChange={(e) => setSortMethod(e.target.value as SortMethod)}
                        disabled={isSorting}
                        className="w-full appearance-none bg-zinc-50 border border-zinc-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm disabled:opacity-50 cursor-pointer"
                      >
                        <option value="selection">Selection Sort</option>
                        <option value="insertion">Insertion Sort</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>

                    {!isSorting ? (
                      <button 
                        onClick={startSorting}
                        className="flex-1 bg-black text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 shadow-lg shadow-zinc-200"
                      >
                        <Play className="w-4 h-4 fill-current" /> Start {sortMethod.charAt(0).toUpperCase() + sortMethod.slice(1)}
                      </button>
                    ) : (
                      <button 
                        onClick={stopSorting}
                        className="flex-1 bg-red-50 text-red-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-all"
                      >
                        <Pause className="w-4 h-4 fill-current" /> Stop Visualization
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                          type="text" 
                          placeholder="Search value..."
                          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                          value={intSearch}
                          onChange={(e) => setIntSearch(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={handleSearch}
                        className="px-6 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-50 transition-all"
                      >
                        Search
                      </button>
                    </div>
                    <form onSubmit={addInteger} className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Add to graph..."
                        disabled={isSorting}
                        className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium disabled:opacity-50"
                        value={newInt}
                        onChange={(e) => setNewInt(e.target.value)}
                      />
                      <button 
                        type="submit"
                        disabled={isSorting}
                        className="px-6 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-50 transition-all disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Section B: Simple Entity List */}
          <div className="xl:col-span-5 space-y-8">
            <section className="bg-white rounded-[32px] border border-zinc-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden h-full flex flex-col">
              <div className="p-8 border-b border-zinc-100 bg-white">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-mono text-lg">02</div>
                    Word Explorer
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Simple String Array</p>
                </div>
              </div>

              <div className="p-8 space-y-8 flex-1 flex flex-col">
                {/* Search & Sort Bar */}
                <div className="flex flex-col gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Search words..."
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                      value={entitySearch}
                      onChange={(e) => setEntitySearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => sortEntities('asc')}
                      className="flex-1 px-6 py-3 rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <SortAsc className="w-4 h-4" /> A-Z
                    </button>
                    <button 
                      onClick={() => sortEntities('desc')}
                      className="flex-1 px-6 py-3 rounded-2xl border border-zinc-200 hover:bg-zinc-50 transition-all text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <SortDesc className="w-4 h-4" /> Z-A
                    </button>
                  </div>
                </div>

                {/* Word List */}
                <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                  <AnimatePresence mode="popLayout">
                    {filteredEntities.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="group p-4 bg-zinc-50 border border-zinc-100 rounded-2xl hover:border-emerald-200 hover:bg-white transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                            {item.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-zinc-800">{item.name}</span>
                        </div>
                        <button 
                          onClick={() => removeEntity(item.id)}
                          className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {filteredEntities.length === 0 && (
                    <div className="py-12 text-center space-y-4">
                      <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6 text-zinc-300" />
                      </div>
                      <p className="text-sm font-bold text-zinc-400">No matches found</p>
                    </div>
                  )}
                </div>

                {/* Add New Word Form */}
                <div className="pt-6 border-t border-zinc-100">
                  <form onSubmit={addEntity} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add a new word..."
                      className="flex-1 px-4 py-3 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
                      value={newEntity}
                      onChange={(e) => setNewEntity(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="px-6 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-200"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>

        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-zinc-200 flex justify-center text-zinc-400">
          
        </footer>
      </div>

      {/* Search Result Modal */}
      <AnimatePresence>
        {searchResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-zinc-200 text-center space-y-6"
            >
              <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                searchResult === 'found' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}>
                {searchResult === 'found' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">
                  {searchResult === 'found' ? 'Value Found!' : 'Not Found'}
                </h3>
                <p className="text-zinc-500 font-medium">
                  {searchResult === 'found' 
                    ? `The value ${intSearch} exists in the current array.` 
                    : `We couldn't find ${intSearch} in the current dataset.`}
                </p>
              </div>
              <button 
                onClick={() => setSearchResult(null)}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-95"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E4E4E7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D4D4D8;
        }
      `}</style>
    </div>
  );
}
