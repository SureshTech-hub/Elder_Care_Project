import React from 'react';

interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  rows = 4,
  columns = 4,
  className = '',
}) => {
  return (
    <div className={`w-full bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs animate-pulse ${className}`}>
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/4 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex gap-4">
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="h-8 bg-slate-100 dark:bg-slate-700/60 rounded-md flex-1"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
