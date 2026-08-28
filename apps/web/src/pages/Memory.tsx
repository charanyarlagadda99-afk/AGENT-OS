import React, { useState } from 'react';
import { Brain, Search, Plus, Filter } from 'lucide-react';
import { getDemoMemories } from '../lib/demoData';

export const Memory = () => {
  const memories = getDemoMemories();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = filterType === 'ALL' ? memories : memories.filter(m => m.memory_type === filterType);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 font-mono">
            <Brain className="w-6 h-6 text-purple-400" />
            Agent Persistent Memory Bank
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">Short-term, episodic, semantic, user, and agent operational facts.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3 font-mono text-xs">
        {['ALL', 'EPISODIC', 'SEMANTIC', 'USER', 'AGENT'].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded transition-all ${
              filterType === type
                ? 'bg-purple-950 text-purple-400 border border-purple-800/50 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-3 font-mono text-xs">
        {filtered.map((m: any) => (
          <div key={m.id} className="card p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800/50 font-bold text-[10px]">
                {m.memory_type}
              </span>
              <span className="text-zinc-500 text-[10px]">Importance: {m.importance}/100</span>
            </div>
            <p className="text-zinc-200 leading-relaxed">{m.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
