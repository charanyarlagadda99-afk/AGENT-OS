import React from 'react';
import { cn } from '../lib/cn';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center bg-zinc-900 rounded-lg border border-zinc-800', className)}>
      <Icon className="w-12 h-12 text-zinc-500 mb-4" />
      <h3 className="text-lg font-medium text-zinc-200 mb-2">{title}</h3>
      <p className="text-zinc-400 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
