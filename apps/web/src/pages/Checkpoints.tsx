import React from 'react';
import { GitBranch, RotateCcw, Clock } from 'lucide-react';

export const Checkpoints = () => {
  const checkpoints = [
    { id: 'ckpt-1', label: 'Initial Mission State', mission: 'Make demo-broken-repo production-ready', created_at: new Date().toISOString() },
    { id: 'ckpt-2', label: 'Post Repository Inspection', mission: 'Make demo-broken-repo production-ready', created_at: new Date(Date.now() - 300000).toISOString() },
    { id: 'ckpt-3', label: 'Installed cors dependency', mission: 'Make demo-broken-repo production-ready', created_at: new Date(Date.now() - 600000).toISOString() },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-cyan-400" />
            Execution Checkpoints Browser
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Roll back and restore persistent agent execution snapshots.</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {checkpoints.map(ckpt => (
          <div key={ckpt.id} className="card p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">{ckpt.id}</span>
                <span className="text-zinc-200 font-semibold">{ckpt.label}</span>
              </div>
              <div className="text-zinc-400 text-[11px]">{ckpt.mission}</div>
            </div>

            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs transition-colors">
              <RotateCcw size={14} /> Restore Snapshot
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
