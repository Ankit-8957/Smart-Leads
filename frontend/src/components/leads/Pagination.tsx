import React from 'react';
import { PaginationMeta } from '../../types';
import { Button } from '../ui';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  const { currentPage, totalPages, totalCount, limit } = meta;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalCount);

  if (totalPages <= 1) return null;

  // Build page numbers with ellipsis
  const getPages = (): (number | '...')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3)
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex items-center justify-between px-1">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing <span className="font-medium">{start}–{end}</span> of{' '}
        <span className="font-medium">{totalCount}</span> results
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          disabled={!meta.hasPrevPage}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ‹ Prev
        </Button>
        {getPages().map((page, i) =>
          page === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                ${page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              {page}
            </button>
          )
        )}
        <Button
          variant="ghost"
          size="sm"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next ›
        </Button>
      </div>
    </div>
  );
};

export default Pagination;