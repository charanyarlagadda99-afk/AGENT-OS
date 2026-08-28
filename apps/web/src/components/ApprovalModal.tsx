import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Check, X, Info } from 'lucide-react';

export type RiskLevel = 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'LOW';

export interface ApprovalModalProps {
  approval: any;
  isOpen?: boolean;
  onApprove: (reason?: string) => void;
  onReject: (reason?: string) => void;
  onClose: () => void;
}

const riskConfig: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  LOW: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', glow: '' },
  MEDIUM: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', glow: '' },
  HIGH: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' },
  CRITICAL: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.2)]' },
};

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  approval,
  isOpen = true,
  onApprove,
  onReject,
  onClose
}) => {
  const [reason, setReason] = useState('');
  if (!isOpen || !approval) return null;

  const riskLevel = approval.risk_level || approval.riskLevel || 'HIGH';
  const conf = riskConfig[riskLevel] || riskConfig.HIGH;

  const actionSummary = approval.action_type || approval.actionSummary || 'Execute Action';
  const payloadStr = typeof approval.action_payload === 'string'
    ? approval.action_payload
    : JSON.stringify(approval.action_payload || approval.payload || {}, null, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-zinc-950/80">
      <div className={`w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden ${conf.glow} font-sans`}>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b ${conf.border} ${conf.bg} flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            {riskLevel === 'CRITICAL' ? (
              <ShieldAlert className={`w-6 h-6 ${conf.color} animate-pulse`} />
            ) : (
              <AlertTriangle className={`w-6 h-6 ${conf.color}`} />
            )}
            <h2 className="text-lg font-bold text-white tracking-wide">Action Authorization Required</h2>
          </div>
          <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${conf.border} ${conf.color}`}>
            {riskLevel} RISK
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-mono font-bold text-zinc-400 mb-1 uppercase">Action Summary</h3>
            <p className="text-zinc-100 font-medium text-sm">{actionSummary}</p>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold text-zinc-400 mb-2 uppercase">Command Payload Details</h3>
            <div className="bg-[#121212] rounded-lg border border-zinc-800 p-3 overflow-x-auto">
              <pre className="text-xs font-mono text-zinc-300">
                {payloadStr}
              </pre>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase">Expected Impact</h3>
            <p className="text-xs text-zinc-300">Command will be executed in workspace sandbox with CPU/RAM isolation.</p>
          </div>

          <div className="flex items-center space-x-2 text-xs p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
            <Info className="w-4 h-4 text-zinc-400" />
            <span className="text-emerald-400">
              Checkpoint created prior to action execution.
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-zinc-400 mb-2">
              Authorization Reason (Optional)
            </label>
            <textarea 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none h-20"
              placeholder="Add your approval notes..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-end space-x-3 text-xs font-mono">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={() => onReject(reason)}
            className="flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 hover:border-red-500 rounded-lg font-bold transition-all"
          >
            <X className="w-4 h-4 mr-1.5" />
            Reject Action
          </button>
          
          <button 
            onClick={() => onApprove(reason)}
            className="flex items-center px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
          >
            <Check className="w-4 h-4 mr-1.5" />
            Approve & Execute
          </button>
        </div>

      </div>
    </div>
  );
};
