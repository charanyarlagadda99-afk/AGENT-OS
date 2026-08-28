import React, { useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export interface ReplayPlayerProps {
  steps: any[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const ReplayPlayer: React.FC<ReplayPlayerProps> = ({
  steps = [],
  currentStepIndex,
  onStepChange,
  isPlaying,
  onTogglePlay,
}) => {
  useEffect(() => {
    let interval: any;
    if (isPlaying && steps.length > 0) {
      interval = setInterval(() => {
        onStepChange((currentStepIndex + 1) % steps.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, steps.length, onStepChange]);

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      onStepChange(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      onStepChange(currentStepIndex + 1);
    }
  };

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 font-mono text-xs shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center transition-colors shadow-lg shadow-cyan-600/20"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded hover:bg-zinc-800 text-zinc-300 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex >= steps.length - 1}
            className="p-2 rounded hover:bg-zinc-800 text-zinc-300 disabled:opacity-40 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
          <span className="text-zinc-400 font-bold ml-2">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">Speed: 1x</span>
        </div>
      </div>

      {/* Progress Scrubber */}
      <input
        type="range"
        min={0}
        max={Math.max(0, steps.length - 1)}
        value={currentStepIndex}
        onChange={e => onStepChange(Number(e.target.value))}
        className="w-full h-1.5 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
    </div>
  );
};
