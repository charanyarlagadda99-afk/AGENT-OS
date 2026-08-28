import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/cn';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, size = 24 }) => {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <Loader2 className="animate-spin text-cyan-500" size={size} />
    </div>
  );
};
