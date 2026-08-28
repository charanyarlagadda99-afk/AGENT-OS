import React from 'react';
import { useAgents } from '../hooks/useAgents';
import { useMissions } from '../hooks/useMissions';
import { StatusBadge } from '../components/StatusBadge';
import { Bot, Target, Shield, Activity, Plus, Play, ChevronRight, Zap, Terminal, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDemoAgents, getDemoMissions, getDemoAnalytics, getDemoSteps } from '../lib/demoData';

export const Dashboard = () => {
  const { data: apiAgents = [] } = useAgents();
  const { data: apiMissions = [] } = useMissions();

  // Use API data if available, fallback to rich demo state
  const agents = apiAgents.length > 0 ? apiAgents : getDemoAgents();
  const missions = apiMissions.length > 0 ? apiMissions : getDemoMissions();
  const analytics = getDemoAnalytics();
  const recentSteps = getDemoSteps('run-1').slice(-5).reverse();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
            Agent Operating Environment
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              Live Runtime
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1 font-mono">
            Autonomous AI Workers · Real-time Mission Control · Checkpointed Runtime
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/agents/new"
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-all shadow-lg shadow-cyan-600/20"
          >
            <Plus size={14} /> New Agent
          </Link>
          <Link
            to="/missions/new"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs rounded-lg border border-zinc-700/60 transition-all"
          >
            <Target size={14} /> Launch Mission
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono font-medium">ACTIVE AGENTS</span>
            <Bot size={18} className="text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-zinc-100 font-mono">{agents.length}</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5">
              <ArrowUpRight size={12} /> 100% Online
            </span>
          </div>
          <div className="mt-3 text-[11px] text-zinc-500 font-mono">
            {agents.filter((a: any) => a.status === 'RUNNING').length} currently executing
          </div>
        </div>

        <div className="card p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono font-medium">RUNNING MISSIONS</span>
            <Target size={18} className="text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-zinc-100 font-mono">{missions.length}</span>
            <span className="text-xs text-cyan-400 font-mono">
              1 Active
            </span>
          </div>
          <div className="mt-3 text-[11px] text-zinc-500 font-mono">
            {missions.filter((m: any) => m.status === 'COMPLETED').length} completed
          </div>
        </div>

        <div className="card p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono font-medium">PENDING APPROVALS</span>
            <Shield size={18} className="text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-amber-400 font-mono">1</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              Action Required
            </span>
          </div>
          <div className="mt-3 text-[11px] text-zinc-500 font-mono">
            High-risk command execution
          </div>
        </div>

        <div className="card p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl relative overflow-hidden group hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono font-medium">SUCCESS RATE</span>
            <Activity size={18} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-400 font-mono">{analytics.successRate}%</span>
            <span className="text-xs text-emerald-400 font-mono">
              Verified
            </span>
          </div>
          <div className="mt-3 text-[11px] text-zinc-500 font-mono">
            Across {analytics.totalToolCalls} tool invocations
          </div>
        </div>
      </div>

      {/* Main Content Split: Missions & Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Active Missions List (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-200 flex items-center gap-2 font-mono">
              <Target className="w-4 h-4 text-cyan-400" />
              Missions Queue
            </h2>
            <Link to="/missions" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {missions.map((mission: any) => (
              <Link
                key={mission.id}
                to={`/missions/${mission.id}`}
                className="block card p-4 bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={mission.status} />
                      <span className="text-sm font-semibold text-zinc-100 group-hover:text-cyan-400 transition-colors">
                        {mission.title}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1">
                      {mission.objective}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                      {mission.priority}
                    </span>
                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Active Agents Side Panel (1 column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-200 flex items-center gap-2 font-mono">
              <Bot className="w-4 h-4 text-cyan-400" />
              Agent Workers
            </h2>
            <Link to="/agents" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              Manage <ChevronRight size={14} />
            </Link>
          </div>

          <div className="space-y-3">
            {agents.map((agent: any) => (
              <Link
                key={agent.id}
                to={`/agents/${agent.id}`}
                className="block p-3.5 bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-xl transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-cyan-400 transition-colors">
                    {agent.name}
                  </span>
                  <StatusBadge status={agent.status} />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Model: {agent.model}</span>
                  <span className="text-cyan-400/80">{agent.autonomy_level}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Execution Feed Component */}
      <div className="card p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2 font-mono">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Live Execution Feed
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Real-time Stream</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {recentSteps.map((step: any) => (
            <div
              key={step.id}
              className="p-2.5 rounded bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-zinc-500 text-[10px]">
                  {new Date(step.created_at).toLocaleTimeString()}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50 text-[10px]">
                  {step.step_type}
                </span>
                <span className="text-zinc-300 font-semibold">{step.tool_name || 'System'}</span>
                <span className="text-zinc-400 truncate max-w-md">{step.input_summary || step.output_summary}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">{step.duration_ms}ms</span>
                <CheckCircle2 size={14} className="text-emerald-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
