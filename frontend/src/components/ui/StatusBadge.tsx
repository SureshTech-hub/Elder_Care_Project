import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const safeStatus = status || 'PENDING';
  const formatted = safeStatus.replace(/_/g, ' ');

  const getVariant = (s: string) => {
    switch ((s || '').toUpperCase()) {
      case 'ACTIVE':
      case 'COMPLETED':
      case 'RESOLVED':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'IN_PROGRESS':
      case 'SCHEDULED':
      case 'INVESTIGATING':
      case 'ACKNOWLEDGED':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'PENDING':
      case 'ON_HOLD':
      case 'OPEN':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'CANCELLED':
      case 'DISCHARGED':
      case 'INACTIVE':
      case 'DISCONTINUED':
      case 'DISMISSED':
      case 'CLOSED':
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${getVariant(
        status
      )} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75" />
      {formatted}
    </span>
  );
};
