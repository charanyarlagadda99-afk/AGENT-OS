import React from 'react';
import { Settings as SettingsIcon, Shield, Server, Key, Terminal } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 font-sans">
            <SettingsIcon className="w-6 h-6 text-cyan-400" />
            Organization & Security Policies
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Platform configuration, API secrets, sandbox limits, and deployment targets.</p>
        </div>
      </div>

      <div className="card p-6 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-5">
        <h2 className="text-sm font-bold text-zinc-200">Organization Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Organization Name</label>
            <input type="text" className="input-field" value="AgentOS Demo Organization" readOnly />
          </div>
          <div>
            <label className="label">Organization Slug</label>
            <input type="text" className="input-field" value="agentos-demo" readOnly />
          </div>
        </div>
      </div>

      <div className="card p-6 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-5">
        <h2 className="text-sm font-bold text-zinc-200">Sandbox Isolation Limits</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">CPU Limit</label>
            <input type="text" className="input-field" value="2 Cores" readOnly />
          </div>
          <div>
            <label className="label">RAM Memory Limit</label>
            <input type="text" className="input-field" value="2048 MB" readOnly />
          </div>
          <div>
            <label className="label">Timeout Limit</label>
            <input type="text" className="input-field" value="120 Seconds" readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};
