import React from 'react';
import { cn } from '../lib/cn';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getBadgeClass = (s: string) => {
    switch (s.toLowerCase()) {
      case 'idle': return 'badge-idle';
      case 'running': return 'badge-running';
      case 'completed': return 'badge-completed';
      case 'failed': return 'badge-failed';
      case 'paused': return 'badge-paused';
      case 'waiting': return 'badge-waiting';
      case 'planning': return 'badge-planning';
      default: return 'bg-zinc-800 text-zinc-300';
    }
  };

  return (
    <span className={cn('px-2 py-1 text-xs rounded-full font-medium', getBadgeClass(status), className)}>
      {status.toUpperCase()}
    </span>
  );
};
