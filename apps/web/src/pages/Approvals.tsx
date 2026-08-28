import React, { useState } from 'react';
import { useApprovals, useApproveAction, useRejectAction } from '../hooks/useApprovals';
import { Shield, Check, X, AlertTriangle, Clock } from 'lucide-react';
import { getDemoApprovals } from '../lib/demoData';
import { ApprovalModal } from '../components/ApprovalModal';

export const Approvals = () => {
  const { data: apiApprovals = [] } = useApprovals();
  const approvals = apiApprovals.length > 0 ? apiApprovals : getDemoApprovals();
  const [selectedApproval, setSelectedApproval] = useState<any>(null);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 font-mono">
            <Shield className="w-6 h-6 text-amber-400" />
            Human Approval Queue
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">High-risk side effects requiring human review before execution.</p>
        </div>
      </div>

      <div className="space-y-4">
        {approvals.map((approval: any) => (
          <div
            key={approval.id}
            className="card p-5 bg-zinc-900/60 border border-amber-500/30 rounded-xl flex items-center justify-between font-mono text-xs shadow-lg shadow-amber-500/5"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40 text-[10px]">
                  RISK: {approval.risk_level}
                </span>
                <span className="text-zinc-200 font-semibold">{approval.action_type}</span>
                <span className="text-zinc-500">ID: {approval.id}</span>
              </div>
              <p className="text-zinc-400 text-xs">
                Requested action: <code className="text-cyan-400 bg-zinc-950 px-2 py-0.5 rounded">{approval.action_payload?.command || approval.action_type}</code>
              </p>
            </div>

            <button
              onClick={() => setSelectedApproval(approval)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg transition-all shadow-lg shadow-amber-600/20"
            >
              Review Action
            </button>
          </div>
        ))}
      </div>

      {selectedApproval && (
        <ApprovalModal
          approval={selectedApproval}
          isOpen={true}
          onClose={() => setSelectedApproval(null)}
          onApprove={() => setSelectedApproval(null)}
          onReject={() => setSelectedApproval(null)}
        />
      )}
    </div>
  );
};
