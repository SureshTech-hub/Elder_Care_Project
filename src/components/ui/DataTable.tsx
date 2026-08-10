import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found',
  emptyAction,
  onRowClick,
  keyExtractor,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingSkeleton rows={5} columns={columns.length} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No Data Available" message={emptyMessage} action={emptyAction} />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-xs">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`px-5 py-3.5 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick && onRowClick(row)}
              className={`transition-colors ${
                onRowClick
                  ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-700/50'
                  : 'hover:bg-slate-50/40 dark:hover:bg-slate-700/30'
              }`}
            >
              {columns.map((col, idx) => (
                <td key={idx} className={`px-5 py-4 align-middle text-slate-700 dark:text-slate-200 ${col.className || ''}`}>
                  {col.cell
                    ? col.cell(row)
                    : typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : col.accessor
                    ? (row[col.accessor] as unknown as React.ReactNode)
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
