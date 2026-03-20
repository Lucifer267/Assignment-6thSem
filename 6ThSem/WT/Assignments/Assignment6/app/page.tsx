'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, IndianRupee, Receipt, AlertCircle, FileText, Clock, CheckCircle } from 'lucide-react';

interface BreakdownItem {
  slab: string;
  rate: number;
  units: number;
  cost: number;
}

interface CalculationResult {
  total: number;
  breakdown: BreakdownItem[];
  totalUnits: number;
}

export default function ElectricityBillCalculator() {
  const [unitsInput, setUnitsInput] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculateBill = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const u = parseFloat(unitsInput);
    
    if (isNaN(u)) {
      setError('Please enter a valid number.');
      return;
    }
    
    if (u < 0) {
      setError('Units consumed cannot be negative.');
      return;
    }

    let total = 0;
    const breakdown: BreakdownItem[] = [];
    let remaining = u;

    // First 50 units @ Rs. 3.50/unit
    if (remaining > 0) {
      const slabUnits = Math.min(remaining, 50);
      const cost = slabUnits * 3.50;
      total += cost;
      breakdown.push({ slab: 'First 50 units', rate: 3.50, units: slabUnits, cost });
      remaining -= slabUnits;
    }

    // Next 100 units @ Rs. 4.00/unit
    if (remaining > 0) {
      const slabUnits = Math.min(remaining, 100);
      const cost = slabUnits * 4.00;
      total += cost;
      breakdown.push({ slab: 'Next 100 units (51-150)', rate: 4.00, units: slabUnits, cost });
      remaining -= slabUnits;
    }

    // Next 100 units @ Rs. 5.20/unit
    if (remaining > 0) {
      const slabUnits = Math.min(remaining, 100);
      const cost = slabUnits * 5.20;
      total += cost;
      breakdown.push({ slab: 'Next 100 units (151-250)', rate: 5.20, units: slabUnits, cost });
      remaining -= slabUnits;
    }

    // Above 250 units @ Rs. 6.50/unit
    if (remaining > 0) {
      const slabUnits = remaining;
      const cost = slabUnits * 6.50;
      total += cost;
      breakdown.push({ slab: 'Above 250 units', rate: 6.50, units: slabUnits, cost });
      remaining -= slabUnits;
    }

    setResult({ total, breakdown, totalUnits: u });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Official Header */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 text-lg font-semibold opacity-95 tracking-wide">📋 OFFICIAL UTILITY PORTAL</div>
          <div className="flex items-center gap-6">
            <div className="bg-white/20 p-4 rounded text-white">
              <FileText className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight leading-tight">Electricity Bill Calculator</h1>
              <p className="text-lg text-white/85 mt-3">Government Authorization Portal - Tariff Calculation System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 sm:p-8 lg:p-10 flex flex-col gap-10">
        
        <div className="border-l-4 border-blue-600 bg-blue-50 p-6 rounded">
          <p className="text-base text-gray-800 leading-relaxed">
            <strong className="text-lg">Official Notice:</strong> This calculator computes electricity bills based on the prevailing tiered tariff structure. All calculations are as per government rate regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Calculator Form - Official */}
          <div className="lg:col-span-5 bg-white border-3 border-gray-400 overflow-hidden shadow-lg">
            <div className="p-8 border-b-3 border-gray-400 bg-gray-100">
              <h3 className="font-bold flex items-center gap-3 text-gray-800 text-2xl">
                <Calculator className="w-7 h-7 text-blue-600" />
                TARIFF CALCULATION
              </h3>
            </div>
            <div className="p-8 space-y-8">
              <form onSubmit={calculateBill} className="space-y-8">
                <div className="space-y-3">
                  <label htmlFor="units" className="block text-lg font-bold text-gray-800">
                    Monthly Units Consumed (kWh)
                  </label>
                  <input
                    type="number"
                    id="units"
                    step="any"
                    value={unitsInput}
                    onChange={(e) => setUnitsInput(e.target.value)}
                    placeholder="Enter units consumed"
                    className="block w-full border-3 border-gray-400 py-4 px-5 text-lg text-gray-900 shadow-md focus:border-blue-600 focus:ring-blue-500 bg-white outline-none transition-all font-mono"
                  />
                  {error && (
                    <p className="text-base text-red-700 flex items-center gap-2 mt-3 font-bold">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-3 py-6 px-8 border-4 border-blue-600 text-2xl font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors shadow-2xl rounded-lg"
                >
                  <Calculator className="w-8 h-8" />
                  CALCULATE BILL
                </button>
              </form>
            </div>
          </div>

          {/* Results Area - Official */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="bg-white border-3 border-gray-400 overflow-hidden shadow-lg"
                >
                  <div className="p-8 border-b-3 border-gray-400 bg-green-50 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-3 text-green-900 text-2xl">
                      <CheckCircle className="w-7 h-7 text-green-700" />
                      BILL CALCULATION RESULT
                    </h3>
                    <span className="text-lg font-bold text-white bg-green-700 px-4 py-2 rounded">
                      {result.totalUnits} Units
                    </span>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <div className="p-8 bg-gray-50 border-4 border-gray-300">
                      <p className="text-2xl text-gray-800 font-bold uppercase tracking-wider mb-4">Total Electricity Bill Amount</p>
                      <div className="flex items-baseline justify-start gap-4">
                        <IndianRupee className="w-14 h-14 text-gray-700" />
                        <span className="text-8xl font-bold text-green-700 leading-none">{result.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-2xl font-bold text-gray-800 border-b-4 border-gray-400 pb-4 uppercase">Slab-wise Calculation Breakdown</h4>
                      <table className="w-full text-xl border-4 border-gray-400">
                        <thead>
                          <tr className="bg-gray-200 border-b-4 border-gray-400">
                            <th className="text-left px-6 py-5 font-bold text-gray-900 border-r-3 border-gray-400 text-2xl">Slab</th>
                            <th className="text-right px-6 py-5 font-bold text-gray-900 border-r-3 border-gray-400 text-2xl">Units</th>
                            <th className="text-right px-6 py-5 font-bold text-gray-900 border-r-3 border-gray-400 text-2xl">Rate/Unit</th>
                            <th className="text-right px-6 py-5 font-bold text-gray-900 text-2xl">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.breakdown.map((item, index) => (
                            <tr key={index} className="border-b-2 border-gray-400 hover:bg-blue-100 bg-white">
                              <td className="px-6 py-6 font-bold text-gray-900 border-r-3 border-gray-400 text-lg">{item.slab}</td>
                              <td className="text-right px-6 py-6 text-gray-900 border-r-3 border-gray-400 font-mono font-bold text-lg">{item.units.toFixed(2)}</td>
                              <td className="text-right px-6 py-6 text-gray-900 border-r-3 border-gray-400 font-mono font-bold text-lg">Rs. {item.rate.toFixed(2)}</td>
                              <td className="text-right px-6 py-6 font-bold text-green-700 font-mono text-2xl">Rs. {item.cost.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[350px] flex flex-col items-center justify-center text-gray-400 border-3 border-dashed border-gray-400 bg-gray-50 p-8 text-center rounded"
                >
                  <Receipt className="w-16 h-16 mb-4 text-gray-300" />
                  <p className="text-lg text-gray-600 font-bold">Enter monthly units consumed above to calculate bill</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
        
        {/* Official Tariff Schedule */}
        <div className="mt-6 bg-white border-4 border-gray-400 p-10 shadow-lg">
          <h3 className="text-4xl font-bold text-gray-900 mb-8 pb-4 border-b-4 border-gray-400 uppercase">Official Tariff Schedule (Current)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-2xl border-4 border-gray-400">
              <thead>
                <tr className="bg-gray-200 border-b-4 border-gray-400">
                  <th className="text-left px-8 py-6 font-bold text-gray-900 border-r-3 border-gray-400 text-3xl">Consumption Slab</th>
                  <th className="text-right px-8 py-6 font-bold text-gray-900 text-3xl">Tariff Rate (Rs./Unit)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b-2 border-gray-400 hover:bg-blue-100 bg-white">
                  <td className="px-8 py-7 font-bold text-gray-900 border-r-3 border-gray-400 text-2xl">First 50 units</td>
                  <td className="text-right px-8 py-7 font-bold text-gray-900 text-3xl">Rs. 3.50</td>
                </tr>
                <tr className="border-b-2 border-gray-400 hover:bg-blue-100 bg-white">
                  <td className="px-8 py-7 font-bold text-gray-900 border-r-3 border-gray-400 text-2xl">Next 100 units (51-150)</td>
                  <td className="text-right px-8 py-7 font-bold text-gray-900 text-3xl">Rs. 4.00</td>
                </tr>
                <tr className="border-b-2 border-gray-400 hover:bg-blue-100 bg-white">
                  <td className="px-8 py-7 font-bold text-gray-900 border-r-3 border-gray-400 text-2xl">Next 100 units (151-250)</td>
                  <td className="text-right px-8 py-7 font-bold text-gray-900 text-3xl">Rs. 5.20</td>
                </tr>
                <tr className="hover:bg-yellow-200 bg-yellow-100 border-b-2 border-gray-400">
                  <td className="px-8 py-7 font-bold text-gray-900 border-r-3 border-gray-400 text-2xl">Above 250 units</td>
                  <td className="text-right px-8 py-7 font-bold text-gray-900 text-3xl">Rs. 6.50</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-lg text-gray-800 mt-8 border-t-4 border-gray-400 pt-6 font-bold">✓ This calculator uses the prevailing government tariff rates. Rates are subject to revision as per official notifications. For latest updates, refer to the official utility website.</p>
        </div>

      </main>

      {/* Official Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8 border-t-4 border-blue-700 text-center">
        <p className="font-bold text-lg mb-3">GOVERNMENT UTILITY PORTAL</p>
        <p className="text-gray-400 mb-2 text-base">Electricity Tariff Calculation System v1.0</p>
        <p className="text-gray-500 text-base">© 2026 Official Utility Department | Last Updated: March 2026 | For Official Use Only</p>
      </footer>
    </div>
  );
}
