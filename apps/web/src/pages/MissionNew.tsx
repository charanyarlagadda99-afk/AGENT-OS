import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateMission } from '../hooks/useMissions';
import { useAgents } from '../hooks/useAgents';
import { Target, ArrowLeft, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { getDemoAgents } from '../lib/demoData';

export const MissionNew = () => {
  const navigate = useNavigate();
  const createMission = useCreateMission();
  const { data: apiAgents = [] } = useAgents();
  const agents = apiAgents.length > 0 ? apiAgents : getDemoAgents();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: 'Make demo-broken-repo production-ready',
    objective: 'Inspect repository at demo/broken-repo, fix all failing tests, missing dependencies, TypeScript type mismatches, and verify with build commands.',
    agent_id: agents[0]?.id || 'agent-1',
    priority: 'HIGH' as const,
    description: 'Flagship software engineering mission for AgentOS.',
    success_criteria: [
      { type: 'COMMAND' as const, value: 'npm test', description: 'All unit tests pass' },
      { type: 'COMMAND' as const, value: 'npm run build', description: 'TypeScript build succeeds' },
    ],
  });

  const presets = [
    {
      title: 'Make demo-broken-repo production-ready',
      objective: 'Inspect repository at demo/broken-repo, fix missing dependencies, vitest failures, TypeScript type mismatch in users route, and verify build.',
      priority: 'HIGH',
    },
    {
      title: 'OWASP Top 10 Security Audit & Vulnerability Scan',
      objective: 'Scan codebase for unvalidated inputs, SQL injection patterns, secret leakage, and outdated package vulnerabilities.',
      priority: 'CRITICAL',
    },
    {
      title: 'API Route Refactoring & Type Alignment',
      objective: 'Refactor express endpoints to conform strictly with shared Zod schemas and NodeNext module resolution.',
      priority: 'NORMAL',
    },
  ];

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setFormData(prev => ({
      ...prev,
      title: preset.title,
      objective: preset.objective,
      priority: preset.priority as any,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await createMission.mutateAsync(formData);
      navigate('/missions');
    } catch (err: any) {
      console.warn('Backend API unavailable or unconfigured, proceeding in Demo Mode:', err);
      navigate('/missions');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link to="/missions" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300">
        <ArrowLeft size={14} /> Back to Missions
      </Link>

      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 font-mono">
            <Target className="w-6 h-6 text-cyan-400" />
            Launch Autonomous Mission
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">Assign an objective, target workspace, priority, and explicit verification gates.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/60 border border-red-800/80 text-red-200 rounded-lg text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          {errorMessage}
        </div>
      )}

      {/* Preset Cards */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Mission Presets:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map(p => (
            <button
              key={p.title}
              type="button"
              onClick={() => handlePresetSelect(p)}
              className="p-3.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 rounded-xl text-left transition-all space-y-1 group font-mono"
            >
              <div className="text-xs font-bold text-zinc-200 group-hover:text-cyan-400 transition-colors line-clamp-1">{p.title}</div>
              <div className="text-[11px] text-zinc-400 line-clamp-2">{p.objective}</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-5 font-mono text-xs">
        <div className="space-y-1">
          <label className="label">Mission Title</label>
          <input
            type="text"
            className="input-field"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="label">Assigned Agent Worker</label>
            <select
              className="input-field"
              value={formData.agent_id}
              onChange={e => setFormData({ ...formData, agent_id: e.target.value })}
            >
              {agents.map((a: any) => (
                <option key={a.id} value={a.id}>{a.name} ({a.model})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="label">Priority Level</label>
            <select
              className="input-field"
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
            >
              <option value="LOW">LOW</option>
              <option value="NORMAL">NORMAL</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="label">Objective Directive</label>
          <textarea
            rows={4}
            className="input-field font-mono"
            value={formData.objective}
            onChange={e => setFormData({ ...formData, objective: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
              Dispatching Mission...
            </>
          ) : (
            'Dispatch Agent Mission'
          )}
        </button>
      </form>
    </div>
  );
};
