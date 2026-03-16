import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Shuffle, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Settings2,
  CheckCircle2,
  Download
} from 'lucide-react';
import { SortStep } from './types';
import { getRadixSortSteps } from './utils/radixSort';

const DEFAULT_SPEED = 500;
const MAX_SPEED = 2000;
const MIN_SPEED = 50;

export default function App() {
  const [inputNumbers, setInputNumbers] = useState<number[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [showSettings, setShowSettings] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  // Initialize with some random numbers
  useEffect(() => {
    generateRandom();
  }, []);

  const generateRandom = () => {
    const count = Math.floor(Math.random() * 5) + 8; // 8-12 numbers
    const newNumbers = Array.from({ length: count }, () => Math.floor(Math.random() * 999) + 1);
    resetWithNumbers(newNumbers);
  };

  const handleCustomInput = (e: React.FormEvent) => {
    e.preventDefault();
    const numbers = customInput
      .split(/[\s,]+/)
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n >= 0);
    
    if (numbers.length > 0) {
      resetWithNumbers(numbers);
      setCustomInput('');
    }
  };

  const resetWithNumbers = (nums: number[]) => {
    setInputNumbers(nums);
    const newSteps = getRadixSortSteps(nums);
    setSteps(newSteps);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const prevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(nextStep, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentStepIdx, speed, steps]);

  const currentStep = steps[currentStepIdx];
  
  const getStatusMessage = () => {
    if (!currentStep) return 'Initializing...';
    switch (currentStep.type) {
      case 'START': return 'Ready to sort. Click play to begin.';
      case 'FIND_MAX': return `Finding the maximum number: ${currentStep.max}. This determines how many digits we need to process.`;
      case 'PREPARE_DIGIT': return `Processing the ${currentStep.digitPlace}'s place digit.`;
      case 'DISTRIBUTE': return `Placing numbers into buckets based on their ${currentStep.digitPlace}'s place digit.`;
      case 'COLLECT': return `Collecting numbers back from buckets in order (0 to 9).`;
      case 'FINISHED': return 'Sorting complete!';
      default: return '';
    }
  };

  const getDigit = (num: number, place: number) => {
    return Math.floor((num / place) % 10);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="bg-white border-b border-black/5 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Settings2 size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Radix Sort</h1>
            <p className="text-xs text-black/40 font-medium uppercase tracking-wider">Algorithm Visualizer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isInstallable && (
            <button 
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
            >
              <Download size={16} />
              Install App
            </button>
          )}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-black text-white' : 'hover:bg-black/5'}`}
          >
            <Plus size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Controls & Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Controls Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={prevStep}
                  disabled={currentStepIdx === 0}
                  className="p-3 rounded-xl hover:bg-black/5 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>
                <button 
                  onClick={nextStep}
                  disabled={currentStepIdx === steps.length - 1}
                  className="p-3 rounded-xl hover:bg-black/5 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <button 
                onClick={() => resetWithNumbers(inputNumbers)}
                className="w-full py-3 rounded-xl border border-black/10 font-medium flex items-center justify-center gap-2 hover:bg-black/5 transition-all"
              >
                <RotateCcw size={18} /> Reset
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-black/40">
                <span>Speed</span>
                <span>{speed}ms</span>
              </div>
              <input 
                type="range" 
                min={MIN_SPEED} 
                max={MAX_SPEED} 
                step={50}
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full h-1.5 bg-black/5 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="pt-4 border-t border-black/5 space-y-3">
              <button 
                onClick={generateRandom}
                className="w-full py-3 rounded-xl bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-black/80 transition-all"
              >
                <Shuffle size={18} /> Randomize
              </button>
              
              <form onSubmit={handleCustomInput} className="space-y-2">
                <input 
                  type="text" 
                  placeholder="e.g. 12, 45, 7, 23"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all text-sm"
                />
                <button 
                  type="submit"
                  className="w-full py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                >
                  Apply Custom Numbers
                </button>
              </form>
            </div>
          </div>

          {/* Status Message Card */}
          <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/20">
            <div className="flex items-start gap-3">
              <Info size={20} className="shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sm uppercase tracking-widest opacity-70 mb-2">Current Step</h3>
                <p className="text-lg font-medium leading-snug">{getStatusMessage()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-3 space-y-6">
          {/* Main Array Visualization */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-black/40">Main Array</h2>
              <div className="flex items-center gap-2 text-xs font-mono bg-black/5 px-3 py-1 rounded-full">
                Step {currentStepIdx + 1} / {steps.length}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-end justify-center flex-grow py-12">
              <AnimatePresence mode="popLayout">
                {currentStep?.array?.map((num, idx) => {
                  const isHighlighted = currentStep.type === 'DISTRIBUTE' && currentStep.currentIdx === idx;
                  const digit = currentStep.type === 'DISTRIBUTE' || currentStep.type === 'COLLECT' || currentStep.type === 'PREPARE_DIGIT' 
                    ? getDigit(num, currentStep.digitPlace) 
                    : null;

                  return (
                    <motion.div
                      key={`${num}-${idx}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: isHighlighted ? 1.1 : 1,
                        borderColor: isHighlighted ? '#059669' : 'rgba(0,0,0,0.1)'
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`relative w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-colors ${
                        isHighlighted ? 'bg-emerald-50 border-emerald-600 shadow-lg shadow-emerald-600/10' : 'bg-white'
                      }`}
                    >
                      <span className="text-xl font-bold tracking-tighter">{num}</span>
                      {digit !== null && (
                        <div className="absolute -bottom-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {digit}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Buckets Visualization */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-black/40 mb-8">Buckets (0-9)</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
              {Array.from({ length: 10 }).map((_, i) => {
                const bucketItems = (currentStep?.type === 'DISTRIBUTE' || currentStep?.type === 'COLLECT') 
                  ? currentStep.buckets[i] 
                  : [];
                
                return (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="h-48 bg-black/[0.02] rounded-2xl border border-dashed border-black/10 flex flex-col-reverse p-2 gap-1 overflow-hidden">
                      <AnimatePresence>
                        {bucketItems.map((num, idx) => (
                          <motion.div
                            key={`${num}-${idx}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-emerald-600 text-white text-[10px] font-bold py-1 rounded-md text-center"
                          >
                            {num}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                    <div className="text-center font-mono text-xs font-bold text-black/30">
                      {i}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Legend */}
      <footer className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl p-6 border border-black/5 flex flex-wrap gap-8 items-center justify-between">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-black/60">Active Element</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-black/5 border border-black/10"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-black/60">Waiting</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-black/40">
            <CheckCircle2 size={16} />
            <span className="text-xs font-medium italic">Radix Sort is a non-comparative sorting algorithm.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
