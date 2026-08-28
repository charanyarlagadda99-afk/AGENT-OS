import React from 'react';
import { useParams } from 'react-router-dom';
import { useAgent } from '../hooks/useAgents';
import { StatusBadge } from '../components/StatusBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const AgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: agent, isLoading } = useAgent(id || '');

  if (isLoading) return <LoadingSpinner size={32} />;
  if (!agent) return <div className="p-8 text-zinc-400">Agent not found.</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">{agent.name}</h1>
          <p className="text-zinc-400">{agent.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={agent.status || 'idle'} />
          <button className="px-4 py-2 bg-cyan-600 text-white rounded font-medium hover:bg-cyan-700">Run Mission</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-zinc-500 w-32 inline-block">Model:</span> <span className="text-zinc-300">{agent.model}</span></p>
            <p><span className="text-zinc-500 w-32 inline-block">Temperature:</span> <span className="text-zinc-300">{agent.temperature}</span></p>
            <p><span className="text-zinc-500 w-32 inline-block">Autonomy:</span> <span className="text-zinc-300">{agent.autonomyLevel}</span></p>
          </div>
        </div>
        
        <div className="card p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">System Instructions</h2>
          <pre className="text-sm text-zinc-400 whitespace-pre-wrap font-sans">{agent.systemInstructions}</pre>
        </div>
      </div>
    </div>
  );
};
