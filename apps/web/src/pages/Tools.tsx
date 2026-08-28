import React from 'react';
import { Zap, ShieldAlert, FileText, Terminal, Globe, Brain, CheckSquare } from 'lucide-react';
import { BUILTIN_TOOLS } from '@agentos/shared';

export const Tools = () => {
  const tools = BUILTIN_TOOLS.map(name => ({
    name,
    scope: name.split('.')[0].toUpperCase(),
    risk: name.includes('execute') || name.includes('write') ? 'HIGH' : 'LOW',
    description: `Built-in tool for ${name} operations inside sandboxed environment.`,
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 font-mono">
            <Zap className="w-6 h-6 text-cyan-400" />
            Central Tool Registry ({tools.length})
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">Capabilities registered and authorized for agent execution.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {tools.map(tool => (
          <div key={tool.name} className="card p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 font-bold">{tool.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                tool.risk === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800/50' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
              }`}>
                {tool.risk}
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] font-sans">{tool.description}</p>
            <div className="text-zinc-500 text-[10px] pt-1 border-t border-zinc-800/60">Scope: {tool.scope}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
