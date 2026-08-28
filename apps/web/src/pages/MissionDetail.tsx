import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMission, useStartMission, usePauseMission, useResumeMission } from '../hooks/useMissions';
import { useExecutionStream } from '../hooks/useExecutionStream';
import { StatusBadge } from '../components/StatusBadge';
import { TaskGraphVisualizer } from '../components/TaskGraphVisualizer';
import { ExecutionConsole } from '../components/ExecutionConsole';
import { ApprovalModal } from '../components/ApprovalModal';
import { Target, Play, Pause, RotateCcw, Shield, CheckCircle2, XCircle, Clock, AlertTriangle, FileCode, CheckSquare, Layers } from 'lucide-react';
import { getDemoMissions, getDemoTasks, getDemoSteps, getDemoApprovals } from '../lib/demoData';

export const MissionDetail = () => {
  const { id = 'mission-1' } = useParams();
  const { data: apiMission } = useMission(id);
  const startMission = useStartMission();
  const pauseMission = usePauseMission();
  const resumeMission = useResumeMission();

  // Fallback to seeded demo state if API endpoint returns empty
  const demoMission = getDemoMissions().find(m => m.id === id) || getDemoMissions()[0];
  const mission = apiMission || demoMission;

  const demoTasks = getDemoTasks(id);
  const demoSteps = getDemoSteps('run-1');
  const demoApproval = getDemoApprovals()[0];

  const [activeTab, setActiveTab] = useState<'console' | 'tasks' | 'artifacts' | 'verification'>('tasks');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [steps, setSteps] = useState<any[]>(demoSteps);

  // SSE Stream integration
  useExecutionStream(id, {
    onStepCompleted: (event) => {
      setSteps(prev => [...prev, event.data]);
    },
  });

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Top Mission Header Bar */}
      <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <StatusBadge status={mission.status} />
            <h1 className="text-xl font-bold tracking-tight text-zinc-100 font-sans">
              {mission.title}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono border border-zinc-700/50">
              ID: {id}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono max-w-2xl">
            Objective: {mission.objective}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {mission.status === 'QUEUED' && (
            <button
              onClick={() => startMission.mutate(id)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg transition-all shadow-lg shadow-cyan-600/20"
            >
              <Play size={14} /> Start Mission
            </button>
          )}

          {mission.status === 'RUNNING' && (
            <button
              onClick={() => pauseMission.mutate(id)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg transition-all"
            >
              <Pause size={14} /> Pause Mission
            </button>
          )}

          {mission.status === 'PAUSED' && (
            <button
              onClick={() => resumeMission.mutate(id)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-all"
            >
              <Play size={14} /> Resume Mission
            </button>
          )}

          <button
            onClick={() => setApprovalModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-mono text-xs rounded-lg border border-amber-500/30 transition-all"
          >
            <Shield size={14} /> 1 Pending Approval
          </button>
        </div>
      </div>

      {/* Primary Split View: Left (Task Graph / Live Console) & Right (Inspection Sidebar) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Tabs + Primary Workspace */}
        <div className="flex-1 flex flex-col border-r border-zinc-800/80 overflow-hidden">
          {/* View Selection Tabs */}
          <div className="flex items-center border-b border-zinc-800/80 bg-zinc-900/40 px-4">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 transition-all ${
                activeTab === 'tasks'
                  ? 'border-cyan-500 text-cyan-400 font-semibold bg-cyan-950/20'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers size={14} /> Task Graph DAG ({demoTasks.length})
            </button>

            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 transition-all ${
                activeTab === 'console'
                  ? 'border-cyan-500 text-cyan-400 font-semibold bg-cyan-950/20'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Target size={14} /> Execution Console ({steps.length})
            </button>

            <button
              onClick={() => setActiveTab('verification')}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-mono border-b-2 transition-all ${
                activeTab === 'verification'
                  ? 'border-cyan-500 text-cyan-400 font-semibold bg-cyan-950/20'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CheckSquare size={14} /> Success Criteria
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'tasks' && (
              <TaskGraphVisualizer tasks={demoTasks} onTaskClick={setSelectedTask} />
            )}

            {activeTab === 'console' && (
              <ExecutionConsole steps={steps} onClear={() => setSteps([])} />
            )}

            {activeTab === 'verification' && (
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-sm font-bold text-zinc-200 font-mono">Explicit Verification Gates</h3>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-zinc-200 font-semibold">npm test</div>
                        <div className="text-zinc-400 text-[11px]">All unit & integration tests pass cleanly with exit code 0</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">PASSED</span>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <div>
                        <div className="text-zinc-200 font-semibold">npm run build</div>
                        <div className="text-zinc-400 text-[11px]">TypeScript compilation succeeds without type errors</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">PASSED</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Task Inspection Sidebar */}
        <div className="w-80 bg-zinc-900/40 p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider mb-3">
              Task Details
            </h3>
            {selectedTask ? (
              <div className="card p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">{selectedTask.id}</span>
                  <StatusBadge status={selectedTask.status} />
                </div>
                <div className="text-zinc-200 font-semibold">{selectedTask.title}</div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{selectedTask.description}</p>
                <div className="text-zinc-500 text-[10px]">Dependencies: {selectedTask.dependencies?.join(', ') || 'None'}</div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/60 text-xs font-mono text-zinc-500 text-center">
                Click any task card in the graph to inspect task inputs & outputs.
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider mb-3">
              Agent Checkpoints
            </h3>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="text-zinc-200">Checkpoint #3</div>
                  <div className="text-zinc-500 text-[10px]">Task 3 completed</div>
                </div>
                <button className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] transition-colors">
                  Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Human Approval Modal */}
      <ApprovalModal
        approval={demoApproval}
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        onApprove={() => setApprovalModalOpen(false)}
        onReject={() => setApprovalModalOpen(false)}
      />
    </div>
  );
};
