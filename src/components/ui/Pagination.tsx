import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-1 text-sm">
      <div className="text-slate-500 dark:text-slate-400">
        Showing <span className="font-medium text-slate-900 dark:text-slate-200">{startItem}</span> to{' '}
        <span className="font-medium text-slate-900 dark:text-slate-200">{endItem}</span> of{' '}
        <span className="font-medium text-slate-900 dark:text-slate-200">{totalItems}</span> results
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
