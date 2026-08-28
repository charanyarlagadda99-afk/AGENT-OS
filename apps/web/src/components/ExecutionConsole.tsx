import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Trash2, Search, Play, AlertTriangle, CheckCircle, Info, Cpu } from 'lucide-react';

export interface ExecutionConsoleProps {
  steps: any[];
  onClear?: () => void;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({ steps = [], onClear }) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  const filteredSteps = steps.filter(step => {
    const stepType = step.step_type || step.type || '';
    const matchType = filterLevel === 'ALL' || stepType === filterLevel;
    const summary = (step.input_summary || step.output_summary || step.content || '').toLowerCase();
    const matchSearch = !searchTerm || summary.includes(searchTerm.toLowerCase()) || (step.tool_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  useEffect(() => {
    if (autoScroll) {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredSteps, autoScroll]);

  const copyToClipboard = () => {
    const text = filteredSteps.map(s => `[${s.step_type || s.type}] ${s.tool_name || 'System'}: ${s.input_summary || s.output_summary || s.content}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden font-mono text-xs shadow-2xl">
      {/* Control Header */}
      <div className="flex flex-wrap items-center justify-between p-3 bg-zinc-900/80 border-b border-zinc-800/80 gap-3">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-cyan-400" />
          <span className="font-bold text-zinc-200">Execution Console</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
            {filteredSteps.length} Events
          </span>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800/80">
          {['ALL', 'PLAN', 'TOOL_CALL', 'OBSERVATION', 'ERROR'].map(level => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-2.5 py-1 rounded text-[10px] transition-all font-semibold ${
                filterLevel === level
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 pl-8 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 w-36"
            />
          </div>

          <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 cursor-pointer">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={e => setAutoScroll(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-800 text-cyan-500 focus:ring-0"
            />
            Auto-scroll
          </label>

          <button onClick={copyToClipboard} className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors" title="Copy Logs">
            <Copy size={14} />
          </button>
          {onClear && (
            <button onClick={onClear} className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors" title="Clear Console">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-zinc-950 custom-scrollbar">
        {filteredSteps.length === 0 ? (
          <div className="py-12 text-center text-zinc-600">No execution events recorded matching filter.</div>
        ) : (
          filteredSteps.map((step, idx) => {
            const stepType = step.step_type || step.type || 'INFO';
            const timestamp = step.created_at || step.timestamp ? new Date(step.created_at || step.timestamp).toLocaleTimeString() : '';
            
            return (
              <div key={step.id || idx} className="flex items-start gap-3 p-2 rounded hover:bg-zinc-900/50 border border-transparent hover:border-zinc-800/60 transition-colors">
                <span className="text-[10px] text-zinc-500 font-mono w-16 flex-shrink-0 pt-0.5">{timestamp}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800/50 flex-shrink-0">
                  {stepType}
                </span>
                {step.tool_name && (
                  <span className="text-emerald-400 font-bold flex-shrink-0">[{step.tool_name}]</span>
                )}
                <div className="text-zinc-300 flex-1 whitespace-pre-wrap leading-relaxed">
                  {step.input_summary || step.output_summary || step.content}
                </div>
                {step.duration_ms && (
                  <span className="text-[10px] text-zinc-500 flex-shrink-0">{step.duration_ms}ms</span>
                )}
              </div>
            );
          })
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};
