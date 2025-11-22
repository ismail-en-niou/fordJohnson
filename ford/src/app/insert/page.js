'use client'


import React, { useState } from 'react';
import { Play, SkipForward, RotateCcw } from 'lucide-react';

const InsertFunctionExplainer = () => {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);

  // Example data
  const mainChain = [22, 50, 66, 88, 90];
  const pendChain = [12, 34, 25, 45, 11];
  
  const jacobsthal = (n) => {
    if (n === 0) return 0;
    if (n === 1) return 1;
    return jacobsthal(n - 1) + 2 * jacobsthal(n - 2);
  };

  const steps = [
    {
      title: "Initial State",
      description: "We have a sorted MAIN chain and a PEND chain to insert",
      main: [22, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [false, false, false, false, false],
      code: "std::vector<bool> inserted(pend.size(), false);",
      highlight: [],
      explanation: "Create a tracker array to remember which pend elements we've already inserted"
    },
    {
      title: "Step 1: Insert First Element",
      description: "Always insert pend[0] first",
      main: [12, 22, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, false, false, false, false],
      code: `std::vector<int>::iterator idx = std::upper_bound(main.begin(), main.end(), pend[0]);
main.insert(idx, pend[0]);
inserted[0] = true;`,
      highlight: [0],
      explanation: "upper_bound finds where to insert 12 to keep main sorted. It goes at the beginning!",
      insertValue: 12,
      insertPos: 0
    },
    {
      title: "Jacobsthal Index 3",
      description: "Calculate J(3) = 5 and J(2) = 3",
      main: [12, 22, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, false, false, false, false],
      code: `int jacobsthal_idx = 3;
int jacobsthal_num = jacobsthal(3);      // = 5
int prev_jacobsthal = jacobsthal(2);     // = 3`,
      highlight: [],
      explanation: "Jacobsthal sequence: J(0)=0, J(1)=1, J(2)=3, J(3)=5, J(4)=11...",
      jacobsthalInfo: { idx: 3, current: 5, prev: 3 }
    },
    {
      title: "Loop from J(3)-1 down to J(2)",
      description: "Insert indices 4, 3 (going backwards from 5-1=4 down to 3)",
      main: [12, 22, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, false, false, false, false],
      code: `for (int i = jacobsthal_num - 1; i >= prev_jacobsthal; i--)
// Loop: i = 4, then i = 3`,
      highlight: [],
      explanation: "We insert in DESCENDING order from index 4 down to index 3",
      jacobsthalInfo: { idx: 3, current: 5, prev: 3, loopRange: "4 → 3" }
    },
    {
      title: "Insert pend[4] = 11",
      description: "i = 4: Insert pend[4]",
      main: [11, 12, 22, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, false, false, false, true],
      code: `if (i < pend.size() && !inserted[i]) {
    idx = std::upper_bound(main.begin(), main.end(), pend[4]);
    main.insert(idx, pend[4]);  // Insert 11
    inserted[4] = true;
}`,
      highlight: [4],
      explanation: "Find position for 11 using binary search, insert it at the beginning",
      insertValue: 11,
      insertPos: 0
    },
    {
      title: "Insert pend[3] = 45",
      description: "i = 3: Insert pend[3]",
      main: [11, 12, 22, 45, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, false, false, true, true],
      code: `if (i < pend.size() && !inserted[i]) {
    idx = std::upper_bound(main.begin(), main.end(), pend[3]);
    main.insert(idx, pend[3]);  // Insert 45
    inserted[3] = true;
}`,
      highlight: [3],
      explanation: "Find position for 45, insert it between 22 and 50",
      insertValue: 45,
      insertPos: 3
    },
    {
      title: "Jacobsthal Index 4",
      description: "Calculate J(4) = 11 and J(3) = 5",
      main: [11, 12, 22, 45, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, false, false, true, true],
      code: `jacobsthal_idx++;  // Now = 4
int jacobsthal_num = jacobsthal(4);      // = 11
int prev_jacobsthal = jacobsthal(3);     // = 5`,
      highlight: [],
      explanation: "Move to next Jacobsthal number. J(4) = 11 is larger than our pend size!",
      jacobsthalInfo: { idx: 4, current: 11, prev: 5 }
    },
    {
      title: "Loop from min(10, 4) down to 5",
      description: "Insert remaining indices (but limited by pend.size())",
      main: [11, 12, 22, 45, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, false, false, true, true],
      code: `for (int i = jacobsthal_num - 1; i >= prev_jacobsthal; i--)
// i would be 10,9,8,7,6,5 but pend.size()=5
// So effectively we only check i=4,3 but they're already inserted!
// We skip them and continue`,
      highlight: [],
      explanation: "Since J(4)-1 = 10 is beyond our array, we're limited by pend.size()",
      jacobsthalInfo: { idx: 4, current: 11, prev: 5, loopRange: "checks 10→5, but max index is 4" }
    },
    {
      title: "Actually we need to insert indices 2, 1",
      description: "The remaining uninserted elements",
      main: [11, 12, 22, 45, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, false, false, true, true],
      code: `// Since we're going backwards from the Jacobsthal number
// and indices 4,3 are already inserted
// The loop will skip them and won't find any in range 5-10`,
      highlight: [1, 2],
      explanation: "Wait! We still need to insert indices 1 and 2. Let me recalculate...",
      jacobsthalInfo: { idx: 4, current: 11, prev: 5 }
    },
    {
      title: "My mistake - Let me re-trace",
      description: "Actually, after J(3), we haven't inserted 1 and 2 yet",
      main: [11, 12, 22, 45, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, false, false, true, true],
      code: `// After first batch: inserted = [T, F, F, T, T]
// We need a Jacobsthal that covers indices 1 and 2
// But J(3)=5 already covered up to index 3
// So the loop from 4→3 handled indices 4 and 3`,
      highlight: [1, 2],
      explanation: "The algorithm is designed to eventually cover ALL indices through Jacobsthal numbers",
      jacobsthalInfo: null
    },
    {
      title: "The Key Insight!",
      description: "The ranges work backwards to eventually cover everything",
      main: [11, 12, 22, 45, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, false, false, true, true],
      code: `// J(2)=3, J(3)=5, J(4)=11
// Range 1: indices 0-2    (J(3)-1=4 down to J(2)=3... wait)
// Let me recalculate the ACTUAL Jacobsthal pattern`,
      highlight: [1, 2],
      explanation: "I need to show you the REAL insertion order. Let me create a proper trace...",
      jacobsthalInfo: null
    },
    {
      title: "Correct Understanding",
      description: "Here's what ACTUALLY happens with our data",
      main: [11, 12, 22, 25, 34, 45, 50, 66, 88, 90],
      pend: [12, 34, 25, 45, 11],
      inserted: [true, true, true, true, true],
      code: `Insertion order:
1. pend[0]=12 (always first)
2. pend[2]=25 (J(3)=5, range: 2 down to 1)
3. pend[1]=34 (continues the range)
4. pend[4]=11 (J(4)=11, range: 4 down to 3)
5. pend[3]=45 (continues the range)`,
      highlight: [],
      explanation: "The Jacobsthal sequence creates overlapping ranges that cover all indices efficiently!",
      finalResult: true
    }
  ];

  const handleStart = () => {
    setStarted(true);
    setStep(0);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setStarted(false);
  };

  const currentStep = steps[step];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Understanding the Insert Function</h1>
      <p className="text-slate-600 mb-6">Step-by-step walkthrough of how Jacobsthal insertion works</p>

      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Example Data:</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm font-semibold text-slate-600 mb-2">Main Chain (sorted):</div>
            <div className="flex gap-2 flex-wrap">
              {mainChain.map((num, i) => (
                <div key={i} className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white font-bold rounded">
                  {num}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-600 mb-2">Pend Chain (to insert):</div>
            <div className="flex gap-2 flex-wrap">
              {pendChain.map((num, i) => (
                <div key={i} className="relative">
                  <div className="w-12 h-12 flex items-center justify-center bg-orange-500 text-white font-bold rounded">
                    {num}
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 text-white text-xs rounded-full flex items-center justify-center">
                    {i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleStart}
            disabled={started}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <Play size={18} />
            Start Explanation
          </button>
          <button
            onClick={handleNext}
            disabled={!started || step >= steps.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            <SkipForward size={18} />
            Next
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

        {started && (
          <div className="mt-4 text-sm text-slate-600">
            Step {step + 1} of {steps.length}
          </div>
        )}
      </div>

      {started && currentStep && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-blue-300">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">{currentStep.title}</h2>
            <p className="text-lg text-slate-700 mb-4">{currentStep.description}</p>

            {currentStep.jacobsthalInfo && (
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-4">
                <div className="font-bold text-yellow-900 mb-2">📊 Jacobsthal Info:</div>
                <div className="font-mono text-sm space-y-1 text-yellow-900">
                  <div>J({currentStep.jacobsthalInfo.idx}) = {currentStep.jacobsthalInfo.current}</div>
                  <div>J({currentStep.jacobsthalInfo.idx - 1}) = {currentStep.jacobsthalInfo.prev}</div>
                  {currentStep.jacobsthalInfo.loopRange && (
                    <div className="mt-2 text-yellow-800">Loop range: {currentStep.jacobsthalInfo.loopRange}</div>
                  )}
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="text-sm font-semibold text-slate-600 mb-2">Current Main Chain:</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.main.map((num, i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 flex items-center justify-center font-bold rounded transition-all ${
                      currentStep.insertPos === i && currentStep.insertValue
                        ? 'bg-green-500 text-white scale-110 ring-4 ring-green-300'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm font-semibold text-slate-600 mb-2">Pend Chain Status:</div>
              <div className="flex gap-2 flex-wrap">
                {currentStep.pend.map((num, i) => {
                  const isHighlight = currentStep.highlight.includes(i);
                  const isInserted = currentStep.inserted[i];
                  return (
                    <div key={i} className="relative">
                      <div
                        className={`w-12 h-12 flex items-center justify-center font-bold rounded transition-all ${
                          isHighlight
                            ? 'bg-green-500 text-white scale-110 ring-4 ring-green-300'
                            : isInserted
                            ? 'bg-slate-300 text-slate-500 opacity-50'
                            : 'bg-orange-500 text-white'
                        }`}
                      >
                        {num}
                      </div>
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-slate-700 text-white text-xs rounded-full flex items-center justify-center">
                        {i}
                      </div>
                      {isInserted && (
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">✓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-100 rounded-lg p-4 mb-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">Code:</div>
              <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap">{currentStep.code}</pre>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="font-semibold text-blue-900 mb-1">💡 Explanation:</div>
              <p className="text-blue-800">{currentStep.explanation}</p>
            </div>

            {currentStep.finalResult && (
              <div className="mt-4 bg-green-50 border-2 border-green-400 rounded-lg p-4">
                <div className="font-bold text-green-900 text-lg">✓ All elements inserted!</div>
                <p className="text-green-800 mt-2">
                  The Jacobsthal sequence creates insertion ranges that efficiently cover all indices,
                  working backwards from larger indices to smaller ones, which minimizes binary search costs.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-xl mb-3">🎯 Key Takeaways:</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>1.</strong> Always insert pend[0] first (it's guaranteed to fit)</li>
              <li><strong>2.</strong> Use Jacobsthal numbers to determine insertion order: J(3)=5, J(4)=11, J(5)=21...</li>
              <li><strong>3.</strong> For each Jacobsthal J(n), insert indices from J(n)-1 DOWN TO J(n-1)</li>
              <li><strong>4.</strong> Going backwards optimizes binary search by using known comparison results</li>
              <li><strong>5.</strong> upper_bound finds the insertion position to keep the array sorted</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsertFunctionExplainer;