import React from 'react';
import { BarChart3, TrendingUp, Cpu, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { getDemoAnalytics } from '../lib/demoData';

export const Analytics = () => {
  const analytics = getDemoAnalytics();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Agent Platform Analytics & Metrics
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Autonomous worker completion rates, tool calls, and execution velocity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="card p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
          <div className="text-zinc-400">Total Missions Completed</div>
          <div className="text-3xl font-bold text-emerald-400">{analytics.completedMissions}</div>
        </div>

        <div className="card p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
          <div className="text-zinc-400">Total Tool Calls</div>
          <div className="text-3xl font-bold text-cyan-400">{analytics.totalToolCalls}</div>
        </div>

        <div className="card p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
          <div className="text-zinc-400">Verification Pass Rate</div>
          <div className="text-3xl font-bold text-emerald-400">{analytics.successRate}%</div>
        </div>

        <div className="card p-5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
          <div className="text-zinc-400">Avg Mission Runtime</div>
          <div className="text-3xl font-bold text-zinc-100">{analytics.avgRuntime}s</div>
        </div>
      </div>
    </div>
  );
};
