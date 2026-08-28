import React from 'react';
import { Activity, Play, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Runs = () => {
  const runs = [
    { id: 'run-1', agent: 'Autonomous Software Engineer', mission: 'Make demo-broken-repo production-ready', status: 'RUNNING', steps: 6, duration: '2m 14s' },
    { id: 'run-2', agent: 'Security Auditor Agent', mission: 'OWASP Vulnerability Scan', status: 'COMPLETED', steps: 12, duration: '5m 30s' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Activity className="w-6 h-6 text-cyan-400" />
            Execution Runs & Replay History
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Audit logs and step-by-step playback for completed and running missions.</p>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        {runs.map(run => (
          <Link
            key={run.id}
            to={`/runs/${run.id}`}
            className="card p-4 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-xl flex items-center justify-between transition-all group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-bold">{run.id}</span>
                <span className="text-zinc-200 font-semibold">{run.agent}</span>
              </div>
              <div className="text-zinc-400 text-[11px]">{run.mission}</div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-zinc-400">{run.steps} Steps ({run.duration})</span>
              <ChevronRight size={18} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
