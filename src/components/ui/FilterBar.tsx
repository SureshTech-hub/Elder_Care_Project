import React from 'react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  filters: FilterGroup[];
  onReset?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onReset }) => {
  const hasActiveFilter = filters.some((f) => f.value !== '' && f.value !== 'ALL');

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {filter.label}:
          </label>
          <select
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {hasActiveFilter && onReset && (
        <button
          onClick={onReset}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 underline cursor-pointer"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
