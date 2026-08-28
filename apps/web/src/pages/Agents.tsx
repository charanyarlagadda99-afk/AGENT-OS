import React from 'react';
import { useAgents } from '../hooks/useAgents';
import { StatusBadge } from '../components/StatusBadge';
import { Bot, Plus, ChevronRight, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDemoAgents } from '../lib/demoData';

export const Agents = () => {
  const { data: apiAgents = [] } = useAgents();
  const agents = apiAgents.length > 0 ? apiAgents : getDemoAgents();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 font-mono">
            <Bot className="w-6 h-6 text-cyan-400" />
            Autonomous Agent Directory
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">Configured AI workers with persistent identities, memory scopes, and tool capabilities.</p>
        </div>
        <Link
          to="/agents/new"
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-all shadow-lg shadow-cyan-600/20"
        >
          <Plus size={14} /> Create Agent
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent: any) => (
          <Link
            key={agent.id}
            to={`/agents/${agent.id}`}
            className="card p-5 bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl transition-all group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300">
                  <Cpu size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-100 group-hover:text-cyan-400 transition-colors">{agent.name}</div>
                  <div className="text-[11px] font-mono text-zinc-500">ID: {agent.id}</div>
                </div>
              </div>
              <StatusBadge status={agent.status} />
            </div>

            <p className="text-xs text-zinc-400 line-clamp-2">{agent.description}</p>

            <div className="flex items-center justify-between text-[11px] font-mono border-t border-zinc-800/80 pt-3 text-zinc-400">
              <span>Model: <strong className="text-zinc-200">{agent.model}</strong></span>
              <span>Autonomy: <strong className="text-cyan-400">{agent.autonomy_level}</strong></span>
              <ChevronRight size={16} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
