import React, { useMemo } from 'react';
import { Activity, Clock, CheckCircle, AlertTriangle, PlayCircle } from 'lucide-react';

export interface TaskGraphVisualizerProps {
  tasks: any[];
  onTaskClick?: (task: any) => void;
}

const statusConfig: Record<string, { color: string; bg: string; border: string; icon: any }> = {
  PENDING: { color: 'text-zinc-500', bg: 'bg-zinc-900', border: 'border-zinc-800', icon: Clock },
  READY: { color: 'text-cyan-400', bg: 'bg-cyan-950/30', border: 'border-cyan-900/50', icon: PlayCircle },
  RUNNING: { color: 'text-amber-400', bg: 'bg-amber-950/30', border: 'border-amber-500/50', icon: Activity },
  COMPLETED: { color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-900/50', icon: CheckCircle },
  FAILED: { color: 'text-red-400', bg: 'bg-red-950/30', border: 'border-red-900/50', icon: AlertTriangle },
  BLOCKED: { color: 'text-zinc-600', bg: 'bg-zinc-950', border: 'border-zinc-800', icon: Clock },
  SKIPPED: { color: 'text-zinc-600', bg: 'bg-zinc-950', border: 'border-zinc-800', icon: Clock },
};

export const TaskGraphVisualizer: React.FC<TaskGraphVisualizerProps> = ({ tasks = [], onTaskClick }) => {
  const tasksByLevel = useMemo(() => {
    const levels: Record<string, number> = {};
    const resolved = new Set<string>();
    let changed = true;

    tasks.forEach(t => {
      const deps = t.dependencies || [];
      if (deps.length === 0) {
        levels[t.id] = 0;
        resolved.add(t.id);
      }
    });

    while (changed) {
      changed = false;
      tasks.forEach(t => {
        const deps = t.dependencies || [];
        if (!resolved.has(t.id) && deps.every((d: string) => resolved.has(d))) {
          const maxDepLevel = Math.max(...deps.map((d: string) => levels[d] || 0));
          levels[t.id] = maxDepLevel + 1;
          resolved.add(t.id);
          changed = true;
        }
      });
    }

    const byLevel: Record<number, any[]> = {};
    tasks.forEach(t => {
      const lvl = levels[t.id] ?? 0;
      if (!byLevel[lvl]) byLevel[lvl] = [];
      byLevel[lvl].push(t);
    });

    return Object.entries(byLevel).sort(([a], [b]) => Number(a) - Number(b)).map(([_, ts]) => ts);
  }, [tasks]);

  return (
    <div className="w-full h-full min-h-[400px] bg-zinc-950 rounded-xl border border-zinc-900 overflow-auto p-6 relative font-mono text-xs">
      <div className="relative z-10 flex flex-col items-center space-y-12">
        {tasksByLevel.map((levelTasks, levelIdx) => (
          <div key={levelIdx} className="flex flex-wrap justify-center items-center gap-6">
            {levelTasks.map(task => {
              const statusKey = task.status || 'PENDING';
              const conf = statusConfig[statusKey] || statusConfig.PENDING;
              const Icon = conf.icon;
              const deps = task.dependencies || [];

              return (
                <div 
                  key={task.id}
                  onClick={() => onTaskClick?.(task)}
                  className={`
                    w-64 rounded-xl border p-4 cursor-pointer transition-all duration-300
                    ${conf.bg} ${conf.border}
                    ${task.status === 'RUNNING' ? 'shadow-[0_0_20px_rgba(245,158,11,0.25)] border-amber-500/60' : 'hover:border-zinc-700'}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${conf.color} ${task.status === 'RUNNING' ? 'animate-pulse' : ''}`} />
                      <span className={`text-[11px] font-bold ${conf.color}`}>{task.status}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-zinc-800 text-zinc-300 border border-zinc-700/50">
                      P:{task.priority || 100}
                    </span>
                  </div>
                  
                  <h3 className="text-xs font-medium text-zinc-200 mb-2 font-sans line-clamp-2" title={task.title}>
                    {task.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-3 text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-2 font-mono">
                    <span>{task.id}</span>
                    <span className="flex items-center">
                      <Activity className="w-3 h-3 mr-1" />
                      {deps.length} deps
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
