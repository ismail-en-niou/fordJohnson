'use client'

import React, { useState } from 'react';
import { Play } from 'lucide-react';

const JacobsthalStartExplainer = () => {
  const [showAnswer, setShowAnswer] = useState(false);

  const jacobsthal = (n) => {
    if (n === 0) return 0;
    if (n === 1) return 1;
    return jacobsthal(n - 1) + 2 * jacobsthal(n - 2);
  };

  const jacobsthalSequence = Array.from({ length: 10 }, (_, i) => ({
    n: i,
    value: jacobsthal(i)
  }));

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
      <h1 className="text-4xl font-bold text-slate-800 mb-4">
        Why Start at Jacobsthal(3)? 🤔
      </h1>

      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">Jacobsthal Sequence</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-100">
                <th className="px-4 py-3 text-left font-bold text-purple-900">Index (n)</th>
                <th className="px-4 py-3 text-left font-bold text-purple-900">J(n)</th>
                <th className="px-4 py-3 text-left font-bold text-purple-900">Formula</th>
              </tr>
            </thead>
            <tbody>
              {jacobsthalSequence.map((item, idx) => (
                <tr 
                  key={item.n}
                  className={`border-b ${item.n >= 0 && item.n <= 2 ? 'bg-yellow-50' : item.n === 3 ? 'bg-green-100 font-bold' : 'bg-white'}`}
                >
                  <td className="px-4 py-3 font-mono text-lg">{item.n}</td>
                  <td className="px-4 py-3 font-mono text-xl font-bold text-purple-700">{item.value}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {item.n === 0 ? 'Base case' : 
                     item.n === 1 ? 'Base case' : 
                     `J(${item.n-1}) + 2×J(${item.n-2}) = ${jacobsthal(item.n-1)} + 2×${jacobsthal(item.n-2)} = ${item.value}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={() => setShowAnswer(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all mb-6 text-lg"
      >
        <Play className="inline mr-2" size={24} />
        Click to See Why We Start at J(3)
      </button>

      {showAnswer && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">The Answer:</h2>
            <p className="text-xl mb-4">
              We start at Jacobsthal(3) because <strong>we already handled J(0), J(1), and J(2)</strong> earlier in the algorithm!
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-400">
            <h3 className="text-xl font-bold text-slate-800 mb-4">📋 Let's trace what happens BEFORE the insert function:</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="font-bold text-blue-900 mb-2">Step 1: First element (corresponds to J(0) = 0)</div>
                <p className="text-blue-800 text-sm">The FIRST element of pend (pend[0]) is inserted BEFORE the loop starts:</p>
                <pre className="bg-white p-3 rounded mt-2 text-xs font-mono">
{`if (!pend.empty()) {
    size_t first_idx = 0;
    std::vector<int>::iterator idx = std::upper_bound(..., pend[first_idx]);
    main.insert(idx, pend[first_idx]);
    inserted[first_idx] = true;
}
size_t inserted_count = 1;  // We've inserted 1 element`}
                </pre>
                <div className="mt-2 font-bold text-blue-900">✓ pend[0] is already inserted (covers index 0)</div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <div className="font-bold text-purple-900 mb-2">J(1) = 1 and J(2) = 3</div>
                <p className="text-purple-800 text-sm">These Jacobsthal numbers are too small to create useful ranges:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-purple-800">
                  <li><strong>J(1) = 1:</strong> Range would be from 0 down to 0 → only index 0 (already done!)</li>
                  <li><strong>J(2) = 3:</strong> Range would be from 2 down to 1 → indices 2, 1</li>
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="font-bold text-green-900 mb-2">J(3) = 5 - This is where we start!</div>
                <p className="text-green-800 text-sm">Now we have a meaningful range:</p>
                <div className="bg-white p-3 rounded mt-2">
                  <div className="font-mono text-sm">
                    <div>J(3) = 5, J(2) = 3</div>
                    <div className="mt-2 font-bold text-green-900">Range: from (5-1=4) down to 3</div>
                    <div className="mt-1">Insert indices: <span className="bg-green-200 px-2 py-1 rounded">4, 3</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-slate-800 mb-4">📊 Visual Representation:</h3>
            
            <div className="space-y-4">
              <div className="border-2 border-slate-300 rounded-lg p-4">
                <div className="font-bold mb-2">Pend Chain Indices:</div>
                <div className="flex gap-2 mb-4">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="w-12 h-12 flex items-center justify-center border-2 border-slate-400 rounded font-bold text-slate-700">
                      {i}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-32 font-semibold text-blue-700">Before loop:</div>
                    <div className="flex gap-2">
                      <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded font-bold">
                        0
                      </div>
                      <span className="text-2xl text-slate-400">→</span>
                      <span className="text-sm text-slate-600 self-center">pend[0] inserted first</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-32 font-semibold text-green-700">J(3) range:</div>
                    <div className="flex gap-2">
                      <div className="w-12 h-12 flex items-center justify-center bg-slate-200 text-slate-400 rounded">
                        0
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-slate-200 text-slate-400 rounded">
                        1
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-slate-200 text-slate-400 rounded">
                        2
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded font-bold">
                        3
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded font-bold">
                        4
                      </div>
                      <span className="text-2xl text-slate-400">→</span>
                      <span className="text-sm text-slate-600 self-center">Insert 4, then 3</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-32 font-semibold text-purple-700">J(4) range:</div>
                    <div className="flex gap-2">
                      <div className="w-12 h-12 flex items-center justify-center bg-slate-200 text-slate-400 rounded">
                        0-4
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-purple-500 text-white rounded font-bold">
                        5
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-purple-500 text-white rounded font-bold">
                        6
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-purple-500 text-white rounded font-bold">
                        7
                      </div>
                      <div className="w-12 h-12 flex items-center justify-center bg-purple-500 text-white rounded font-bold">
                        8
                      </div>
                      <span className="text-sm text-slate-600 self-center">→ Insert 10,9,8,7,6,5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">🎯 Summary:</h3>
            <div className="space-y-3 text-lg">
              <div className="flex items-start gap-3">
                <span className="font-bold text-2xl">1.</span>
                <p><strong>pend[0]</strong> is inserted manually before the loop (this handles J(0)=0 and J(1)=1)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-2xl">2.</span>
                <p><strong>J(2)=3</strong> is too small to create a useful range after we've already inserted index 0</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-2xl">3.</span>
                <p><strong>J(3)=5</strong> is the first Jacobsthal number that creates a meaningful insertion range (indices 4 down to 3)</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-bold text-2xl">4.</span>
                <p>Each subsequent Jacobsthal number covers the remaining indices efficiently</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6">
            <h3 className="font-bold text-blue-900 text-xl mb-3">💡 The Mathematical Reason:</h3>
            <p className="text-blue-800 leading-relaxed">
              The Ford-Johnson algorithm is designed so that after inserting the first element (pend[0]), 
              the Jacobsthal sequence starting from J(3) provides the optimal insertion order for the remaining elements. 
              This minimizes the total number of comparisons needed because each insertion range is carefully chosen 
              to maximize the reuse of comparison information from previous insertions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default JacobsthalStartExplainer;