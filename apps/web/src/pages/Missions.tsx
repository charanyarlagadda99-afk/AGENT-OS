import React from 'react';
import { useMissions } from '../hooks/useMissions';
import { StatusBadge } from '../components/StatusBadge';
import { Target, Plus, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDemoMissions } from '../lib/demoData';

export const Missions = () => {
  const { data: apiMissions = [] } = useMissions();
  const missions = apiMissions.length > 0 ? apiMissions : getDemoMissions();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 font-mono">
            <Target className="w-6 h-6 text-cyan-400" />
            Missions Inbox & Execution Queue
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">Autonomous goals dispatched to AI workers with verification gates.</p>
        </div>
        <Link
          to="/missions/new"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-all shadow-lg shadow-cyan-600/20"
        >
          <Plus size={14} /> New Mission
        </Link>
      </div>

      <div className="space-y-3">
        {missions.map((mission: any) => (
          <Link
            key={mission.id}
            to={`/missions/${mission.id}`}
            className="card p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl transition-all group flex items-center justify-between"
          >
            <div className="space-y-1.5 flex-1 pr-6">
              <div className="flex items-center gap-3">
                <StatusBadge status={mission.status} />
                <span className="text-base font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors font-sans">
                  {mission.title}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono line-clamp-1">
                {mission.objective}
              </p>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs text-zinc-400">
              <div className="text-right">
                <div className="text-zinc-500 text-[10px]">Priority</div>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700/50">
                  {mission.priority}
                </span>
              </div>
              <ChevronRight size={20} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
