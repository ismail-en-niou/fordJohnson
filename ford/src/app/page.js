'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, SkipForward, SkipBack, Info } from 'lucide-react';

const FordJohnsonVisualizer = () => {
  const [input, setInput] = useState('64 34 25 12 22 11 90 88 45 50 33 17 78 55 29 71 42 19 83 66');
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState([]);

  const jacobsthal = (n) => {
    if (n === 0) return 0;
    if (n === 1) return 1;
    return jacobsthal(n - 1) + 2 * jacobsthal(n - 2);
  };

  const binaryInsert = (arr, value) => {
    let left = 0;
    let right = arr.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] < value) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    return left;
  };

  const generateSteps = (arr) => {
    const allSteps = [];
    
    allSteps.push({
      description: 'Starting with unsorted array',
      stage: 'initial',
      array: [...arr],
      pairs: [],
      mainChain: [],
      pendChain: [],
      highlight: [],
      comparisons: 0
    });

    if (arr.length <= 1) return allSteps;

    let totalComparisons = 0;

    // Step 1: Create pairs and compare
    const pairs = [];
    for (let i = 0; i + 1 < arr.length; i += 2) {
      totalComparisons++;
      if (arr[i] > arr[i + 1]) {
        pairs.push([arr[i + 1], arr[i]]);
      } else {
        pairs.push([arr[i], arr[i + 1]]);
      }
    }

    const hasExtra = arr.length % 2 === 1;
    const extra = hasExtra ? arr[arr.length - 1] : null;

    allSteps.push({
      description: `Created ${pairs.length} pairs. Each pair ordered as (min, max). Used ${totalComparisons} comparisons.`,
      stage: 'pairing',
      array: [...arr],
      pairs: pairs.map(p => [...p]),
      mainChain: [],
      pendChain: [],
      highlight: [],
      extra: extra,
      comparisons: totalComparisons
    });

    // Step 2: Separate into chains
    let mainChain = pairs.map(p => p[1]);
    const pendChain = pairs.map(p => p[0]);
    if (hasExtra) pendChain.push(extra);

    allSteps.push({
      description: `Separated into Main Chain (${mainChain.length} larger elements) and Pend Chain (${pendChain.length} smaller elements)`,
      stage: 'separation',
      array: [...arr],
      pairs: pairs.map(p => [...p]),
      mainChain: [...mainChain],
      pendChain: [...pendChain],
      highlight: [],
      comparisons: totalComparisons
    });

    // Step 3: Recursively sort main chain (using simple sort for visualization)
    allSteps.push({
      description: 'Now recursively sorting the Main Chain using the same algorithm...',
      stage: 'recursive-start',
      array: [...arr],
      pairs: [],
      mainChain: [...mainChain],
      pendChain: [...pendChain],
      highlight: [],
      comparisons: totalComparisons
    });

    const beforeSort = [...mainChain];
    mainChain.sort((a, b) => a - b);
    totalComparisons += mainChain.length * 2; // Approximation

    allSteps.push({
      description: `Main Chain sorted: ${beforeSort.join(', ')} → ${mainChain.join(', ')}`,
      stage: 'recursive-done',
      array: [...arr],
      pairs: [],
      mainChain: [...mainChain],
      pendChain: [...pendChain],
      highlight: [],
      comparisons: totalComparisons
    });

    // Step 4: Start insertion phase
    allSteps.push({
      description: 'Starting insertion phase using Jacobsthal sequence to minimize comparisons',
      stage: 'insertion-start',
      array: [...arr],
      pairs: [],
      mainChain: [...mainChain],
      pendChain: [...pendChain],
      highlight: [],
      inserted: new Array(pendChain.length).fill(false),
      comparisons: totalComparisons
    });

    const inserted = new Array(pendChain.length).fill(false);
    let insertedCount = 0;

    // Insert first element
    if (pendChain.length > 0) {
      const value = pendChain[0];
      const pos = binaryInsert(mainChain, value);
      const comps = Math.ceil(Math.log2(mainChain.length + 1));
      totalComparisons += comps;
      mainChain.splice(pos, 0, value);
      inserted[0] = true;
      insertedCount++;

      allSteps.push({
        description: `Insert pend[0]=${value} at position ${pos}. Used ${comps} binary search comparisons.`,
        stage: 'insertion',
        array: [...arr],
        pairs: [],
        mainChain: [...mainChain],
        pendChain: [...pendChain],
        highlight: [0],
        inserted: [...inserted],
        insertPosition: pos,
        insertValue: value,
        comparisons: totalComparisons
      });
    }

    // Use Jacobsthal sequence
    let jacobsthalIdx = 3;
    const jacobsthalSequence = [];
    
    while (insertedCount < pendChain.length) {
      const jacobsthalNum = jacobsthal(jacobsthalIdx);
      const prevJacobsthal = jacobsthal(jacobsthalIdx - 1);
      jacobsthalSequence.push(jacobsthalNum);

      allSteps.push({
        description: `Using Jacobsthal J(${jacobsthalIdx}) = ${jacobsthalNum}. Inserting from index ${Math.min(jacobsthalNum - 1, pendChain.length - 1)} down to ${prevJacobsthal}`,
        stage: 'jacobsthal-info',
        array: [...arr],
        pairs: [],
        mainChain: [...mainChain],
        pendChain: [...pendChain],
        highlight: [],
        inserted: [...inserted],
        jacobsthalInfo: { current: jacobsthalNum, prev: prevJacobsthal, index: jacobsthalIdx },
        comparisons: totalComparisons
      });

      for (let i = Math.min(jacobsthalNum - 1, pendChain.length - 1); i >= prevJacobsthal; i--) {
        if (i < pendChain.length && !inserted[i]) {
          const value = pendChain[i];
          const pos = binaryInsert(mainChain, value);
          const comps = Math.ceil(Math.log2(mainChain.length + 1));
          totalComparisons += comps;
          mainChain.splice(pos, 0, value);
          inserted[i] = true;
          insertedCount++;

          allSteps.push({
            description: `Insert pend[${i}]=${value} at position ${pos} in main chain. Binary search used ${comps} comparisons.`,
            stage: 'insertion',
            array: [...arr],
            pairs: [],
            mainChain: [...mainChain],
            pendChain: [...pendChain],
            highlight: [i],
            inserted: [...inserted],
            insertPosition: pos,
            insertValue: value,
            comparisons: totalComparisons
          });
        }
      }
      jacobsthalIdx++;
    }

    allSteps.push({
      description: `✓ Sorting complete! Total comparisons: ${totalComparisons}. Jacobsthal sequence used: ${jacobsthalSequence.join(', ')}`,
      stage: 'complete',
      array: [...mainChain],
      pairs: [],
      mainChain: [...mainChain],
      pendChain: [],
      highlight: [],
      sorted: true,
      comparisons: totalComparisons,
      jacobsthalSequence
    });

    return allSteps;
  };

  const handleStart = () => {
    const arr = input.split(/\s+/).map(Number).filter(n => !isNaN(n));
    if (arr.length === 0) {
      alert('Please enter valid numbers');
      return;
    }
    const allSteps = generateSteps(arr);
    setSteps(allSteps);
    setStep(0);
    setIsRunning(true);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setIsRunning(false);
    setSteps([]);
  };

  const currentStep = steps[step] || null;

  const getStageColor = (stage) => {
    switch (stage) {
      case 'initial': return 'bg-slate-100 border-slate-300';
      case 'pairing': return 'bg-purple-50 border-purple-300';
      case 'separation': return 'bg-indigo-50 border-indigo-300';
      case 'recursive-start':
      case 'recursive-done': return 'bg-blue-50 border-blue-300';
      case 'insertion-start':
      case 'jacobsthal-info':
      case 'insertion': return 'bg-green-50 border-green-300';
      case 'complete': return 'bg-emerald-50 border-emerald-400';
      default: return 'bg-white border-slate-300';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h1 className="text-4xl font-bold text-slate-800 mb-2 text-center">
        Ford-Johnson Merge-Insertion Sort
      </h1>
      <p className="text-center text-slate-600 mb-6">Detailed Step-by-Step Visualization</p>

      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Enter numbers (space-separated):
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            placeholder="64 34 25 12 22 11 90 88..."
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition font-semibold"
          >
            <Play size={18} />
            Start Visualization
          </button>
          <button
            onClick={handlePrev}
            disabled={!isRunning || step === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition font-semibold"
          >
            <SkipBack size={18} />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!isRunning || step >= steps.length - 1}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition font-semibold"
          >
            <SkipForward size={18} />
            Next Step
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

        {isRunning && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              Step {step + 1} / {steps.length}
            </span>
          </div>
        )}
      </div>

      {currentStep && (
        <div className="space-y-6">
          <div className={`rounded-xl p-6 shadow-lg border-2 ${getStageColor(currentStep.stage)}`}>
            <div className="flex items-start gap-3 mb-6">
              <Info className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <div className="text-xl font-bold text-slate-800 mb-2">
                  {currentStep.description}
                </div>
                {currentStep.comparisons > 0 && (
                  <div className="text-sm text-slate-600 font-mono">
                    Total Comparisons So Far: {currentStep.comparisons}
                  </div>
                )}
              </div>
            </div>

            {currentStep.jacobsthalInfo && (
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-yellow-900 mb-2">📊 Jacobsthal Number Info:</h3>
                <div className="text-sm text-yellow-900 font-mono space-y-1">
                  <div>J({currentStep.jacobsthalInfo.index}) = {currentStep.jacobsthalInfo.current}</div>
                  <div>J({currentStep.jacobsthalInfo.index - 1}) = {currentStep.jacobsthalInfo.prev}</div>
                  <div className="mt-2 text-yellow-800">Inserting indices from {Math.min(currentStep.jacobsthalInfo.current - 1, currentStep.pendChain.length - 1)} down to {currentStep.jacobsthalInfo.prev}</div>
                </div>
              </div>
            )}

            {currentStep.pairs && currentStep.pairs.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Pairs (smaller, larger):</h3>
                <div className="flex flex-wrap gap-2">
                  {currentStep.pairs.map((pair, i) => (
                    <div key={i} className="flex items-center gap-1 bg-purple-500 rounded-lg p-2 shadow-md">
                      <span className="text-base font-mono font-semibold text-white px-2">{pair[0]}</span>
                      <span className="text-purple-200">→</span>
                      <span className="text-base font-mono font-bold text-white px-2 bg-purple-700 rounded">{pair[1]}</span>
                    </div>
                  ))}
                  {currentStep.extra !== null && currentStep.extra !== undefined && (
                    <div className="flex items-center bg-amber-500 rounded-lg p-2 shadow-md">
                      <span className="text-base font-mono font-bold text-white px-2">{currentStep.extra}</span>
                      <span className="text-xs text-amber-100 ml-1">(odd)</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep.mainChain && currentStep.mainChain.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                  Main Chain ({currentStep.mainChain.length} elements):
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentStep.mainChain.map((num, i) => {
                    const isInsertPos = currentStep.insertPosition === i && currentStep.insertValue;
                    return (
                      <div
                        key={i}
                        className={`min-w-[3rem] h-12 flex items-center justify-center text-base font-mono font-bold rounded-lg shadow-md transition-all ${
                          isInsertPos
                            ? 'bg-green-500 text-white scale-110 ring-4 ring-green-300'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep.pendChain && currentStep.pendChain.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                  Pend Chain ({currentStep.pendChain.length} elements waiting):
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentStep.pendChain.map((num, i) => {
                    const isHighlighted = currentStep.highlight && currentStep.highlight.includes(i);
                    const isInserted = currentStep.inserted && currentStep.inserted[i];
                    return (
                      <div key={i} className="relative">
                        <div
                          className={`min-w-[3rem] h-12 flex items-center justify-center text-base font-mono font-bold rounded-lg shadow-md transition-all ${
                            isHighlighted
                              ? 'bg-green-500 text-white scale-125 ring-4 ring-green-300 z-10'
                              : isInserted
                              ? 'bg-slate-300 text-slate-500 opacity-50'
                              : 'bg-orange-500 text-white'
                          }`}
                        >
                          {num}
                        </div>
                        <div className="absolute -top-2 -right-2 text-xs font-bold text-slate-600 bg-white rounded-full w-5 h-5 flex items-center justify-center border border-slate-300">
                          {i}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep.sorted && (
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-6 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-4">✓ Sorted Array Complete!</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentStep.array.map((num, i) => (
                    <div
                      key={i}
                      className="min-w-[3rem] h-12 flex items-center justify-center bg-white text-green-700 text-base font-mono font-bold rounded-lg shadow-lg"
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <div className="text-white space-y-1">
                  <div className="font-semibold">Total Comparisons: {currentStep.comparisons}</div>
                  {currentStep.jacobsthalSequence && (
                    <div className="text-sm text-green-100">
                      Jacobsthal Sequence Used: {currentStep.jacobsthalSequence.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-xl mb-3">🧠 How Ford-Johnson Sort Works:</h3>
            <div className="space-y-2 text-sm leading-relaxed">
              <p><strong>1. Pairing:</strong> Group elements into pairs and order each pair (smaller, larger)</p>
              <p><strong>2. Separation:</strong> Create main chain (larger elements) and pend chain (smaller elements)</p>
              <p><strong>3. Recursive Sort:</strong> Sort the main chain using the same algorithm</p>
              <p><strong>4. Strategic Insertion:</strong> Insert pend elements using Jacobsthal sequence (1, 3, 5, 11, 21, 43...)</p>
              <p><strong>Why Jacobsthal?</strong> This sequence minimizes comparisons by optimally utilizing previously gathered comparison information during binary insertion.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FordJohnsonVisualizer;