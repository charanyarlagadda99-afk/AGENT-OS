import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateAgent } from '../hooks/useAgents';
import { Bot, Zap, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AgentNew = () => {
  const navigate = useNavigate();
  const createAgent = useCreateAgent();

  const [formData, setFormData] = useState({
    name: 'Autonomous Software Engineer',
    description: 'Inspects codebases, fixes broken builds, updates tests, and prepares code for production.',
    model: 'gemini-2.5-flash',
    autonomy_level: 'CONFIRMED' as const,
    system_instructions: 'You are an autonomous software worker running inside AgentOS. Perform inspection, execute shell commands safely in a sandbox, write clean code, and verify all success criteria.',
    temperature: 0.2,
    max_steps: 30,
    max_runtime_seconds: 1800,
  });

  const presets = [
    {
      name: 'Software Engineer',
      description: 'Fixes failing tests, updates code, resolves dependency conflicts',
      model: 'gemini-2.5-flash',
      autonomy: 'CONFIRMED',
    },
    {
      name: 'Security Auditor',
      description: 'Performs static code analysis, scans dependencies for vulnerabilities',
      model: 'gemini-2.5-pro',
      autonomy: 'SUPERVISED',
    },
    {
      name: 'DevOps & CI/CD',
      description: 'Prepares Dockerfiles, configures deployment manifests, validates builds',
      model: 'gemini-2.5-flash',
      autonomy: 'AUTONOMOUS',
    },
  ];

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setFormData(prev => ({
      ...prev,
      name: preset.name,
      description: preset.description,
      model: preset.model,
      autonomy_level: preset.autonomy as any,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAgent.mutate(formData, {
      onSuccess: () => navigate('/agents'),
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link to="/agents" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300">
        <ArrowLeft size={14} /> Back to Agents
      </Link>

      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
            <Bot className="w-6 h-6 text-cyan-400" />
            Create Autonomous Agent
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">Configure identity, LLM reasoning model, autonomy policy, and capabilities.</p>
        </div>
      </div>

      {/* Presets Cards */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          One-Click Presets:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presets.map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => handlePresetSelect(p)}
              className="p-3.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 rounded-xl text-left transition-all space-y-1 group"
            >
              <div className="text-xs font-bold text-zinc-200 group-hover:text-cyan-400 transition-colors">{p.name}</div>
              <div className="text-[11px] text-zinc-400 line-clamp-2">{p.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card p-6 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-5 font-mono text-xs">
        <div className="space-y-1">
          <label className="label">Agent Worker Name</label>
          <input
            type="text"
            className="input-field"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="label">Description & Mission Scope</label>
          <input
            type="text"
            className="input-field"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="label">Reasoning Model</label>
            <select
              className="input-field"
              value={formData.model}
              onChange={e => setFormData({ ...formData, model: e.target.value })}
            >
              <option value="gemini-2.5-flash">gemini-2.5-flash (Fast & Cost-Effective)</option>
              <option value="gemini-2.5-pro">gemini-2.5-pro (Deep Reasoning & Complex Code)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="label">Autonomy Level</label>
            <select
              className="input-field"
              value={formData.autonomy_level}
              onChange={e => setFormData({ ...formData, autonomy_level: e.target.value as any })}
            >
              <option value="CONFIRMED">CONFIRMED (Low-risk auto, High-risk requires approval)</option>
              <option value="SUPERVISED">SUPERVISED (Require approval for all side effects)</option>
              <option value="AUTONOMOUS">AUTONOMOUS (Fully automated under strict policy)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="label">System Instructions</label>
          <textarea
            rows={4}
            className="input-field font-mono"
            value={formData.system_instructions}
            onChange={e => setFormData({ ...formData, system_instructions: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-cyan-600/20"
        >
          Create & Provision Agent
        </button>
      </form>
    </div>
  );
};
