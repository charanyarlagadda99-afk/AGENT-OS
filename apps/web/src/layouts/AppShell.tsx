import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Bot, Target, FolderOpen, Shield, Brain, Zap, GitBranch, Activity, BarChart3, Settings, Search, Command, Terminal, Cpu } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/cn';
import { CommandPalette } from '../components/CommandPalette';

export const AppShell = () => {
  const { user } = useAuth();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const links = [
    { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { to: '/agents', icon: Bot, label: 'Agents', badge: '4' },
    { to: '/missions', icon: Target, label: 'Missions', badge: '3' },
    { to: '/workspaces/default', icon: FolderOpen, label: 'Workspaces' },
    { to: '/approvals', icon: Shield, label: 'Approvals', badge: '1', badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { to: '/memory', icon: Brain, label: 'Memory' },
    { to: '/tools', icon: Zap, label: 'Tools', badge: '18' },
    { to: '/checkpoints', icon: GitBranch, label: 'Checkpoints' },
    { to: '/runs', icon: Activity, label: 'Runs' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-zinc-900/90 backdrop-blur-md border-r border-zinc-800/80 flex flex-col z-20">
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Cpu className="w-4 h-4 text-zinc-950 font-bold" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-zinc-100 flex items-center gap-1.5">
                AgentOS
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 font-mono">
                  v1.0
                </span>
              </h1>
              <p className="text-[11px] text-zinc-500 font-mono">Autonomous Execution</p>
            </div>
          </div>
        </div>

        {/* Quick Search Button */}
        <div className="p-3">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition-all shadow-inner group"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
              Quick Command...
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-zinc-800/80 border border-zinc-700/50 rounded text-zinc-400 group-hover:text-zinc-200 font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 custom-scrollbar">
          {links.map(({ to, icon: Icon, label, badge, badgeColor }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 shadow-sm shadow-cyan-950/50'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 border border-transparent'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={16} className="transition-transform group-hover:scale-110" />
                <span>{label}</span>
              </div>
              {badge && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 text-[10px] font-mono rounded-full font-semibold',
                    badgeColor || 'bg-zinc-800 text-zinc-400'
                  )}
                >
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-300">
              {user?.email ? user.email[0].toUpperCase() : 'A'}
            </div>
            <span className="truncate text-zinc-400 font-mono text-[11px]">
              {user?.email || 'operator@agentos.dev'}
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" title="System Online" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-12 bg-zinc-900/60 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <Terminal className="w-4 h-4 text-cyan-500" />
            <span className="text-zinc-500">Workspace:</span>
            <span className="text-zinc-200 bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-700/50">demo-broken-repo</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 bg-zinc-950/60 px-3 py-1 rounded-full border border-zinc-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-zinc-400">Agent Active:</span>
              <span className="text-cyan-400 font-semibold">Software Engineer</span>
            </div>
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 rounded transition-colors"
              title="Command Palette (⌘K)"
            >
              <Command size={16} />
            </button>
          </div>
        </header>

        {/* Page Views */}
        <main className="flex-1 overflow-y-auto bg-zinc-950/90 relative">
          <Outlet />
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
};
