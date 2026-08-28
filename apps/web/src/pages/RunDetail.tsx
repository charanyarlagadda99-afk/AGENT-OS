import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReplayPlayer } from '../components/ReplayPlayer';
import { getDemoSteps } from '../lib/demoData';
import { ArrowLeft, Activity, Bot, Target, Clock, CheckCircle2 } from 'lucide-react';

export const RunDetail = () => {
  const { id = 'run-1' } = useParams();
  const steps = getDemoSteps(id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = steps[currentStepIndex] || steps[0];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="space-y-1">
          <Link to="/runs" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 mb-2">
            <ArrowLeft size={14} /> Back to Execution Runs
          </Link>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-3 font-mono">
            <Activity className="w-5 h-5 text-cyan-400" />
            Execution Replay: {id}
          </h1>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 flex items-center gap-1.5">
            <CheckCircle2 size={12} /> COMPLETED
          </span>
          <span className="text-zinc-500">{steps.length} Steps Recorded</span>
        </div>
      </div>

      {/* Interactive Playback Scrubber Bar */}
      <ReplayPlayer
        steps={steps}
        currentStepIndex={currentStepIndex}
        onStepChange={setCurrentStepIndex}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />

      {/* Step Inspector Card */}
      {currentStep && (
        <div className="card p-6 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 font-bold">
                Step {currentStep.step_number} / {steps.length}
              </span>
              <span className="text-zinc-200 font-semibold">{currentStep.step_type}</span>
              {currentStep.tool_name && (
                <span className="text-cyan-400 font-bold">[{currentStep.tool_name}]</span>
              )}
            </div>
            <span className="text-zinc-500">{currentStep.duration_ms}ms</span>
          </div>

          <div className="space-y-2">
            <div className="text-zinc-400 font-bold">Summary & Execution Output:</div>
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed">
              {currentStep.input_summary || currentStep.output_summary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
