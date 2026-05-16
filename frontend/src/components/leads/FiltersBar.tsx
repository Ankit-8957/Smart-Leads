import React from 'react';
import { LeadFilters, LeadStatus, LeadSource } from '../../types';
import { Input, Select, Button } from '../ui';

interface FiltersBarProps {
  filters: LeadFilters;
  onChange: (filters: LeadFilters) => void;
  onExport: () => void;
  isExporting?: boolean;
  totalCount?: number;
}

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS = [
  { value: 'Website', label: 'Website' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Referral', label: 'Referral' },
];

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest first' },
  { value: 'oldest', label: 'Oldest first' },
];

const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onChange,
  onExport,
  totalCount,
}) => {
  const updateFilter = <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    onChange({ page: 1, sort: 'latest', search: '', status: '', source: '' });
  };

  const hasActiveFilters = filters.search || filters.status || filters.source;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <Input
            label="Search"
            placeholder="Search by name or email..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Status filter */}
        <div className="w-full lg:w-44">
          <Select
            label="Status"
            value={filters.status || ''}
            onChange={(e) => updateFilter('status', e.target.value as LeadStatus | '')}
            options={STATUS_OPTIONS}
            placeholder="All statuses"
          />
        </div>

        {/* Source filter */}
        <div className="w-full lg:w-44">
          <Select
            label="Source"
            value={filters.source || ''}
            onChange={(e) => updateFilter('source', e.target.value as LeadSource | '')}
            options={SOURCE_OPTIONS}
            placeholder="All sources"
          />
        </div>

        {/* Sort */}
        <div className="w-full lg:w-44">
          <Select
            label="Sort by"
            value={filters.sort || 'latest'}
            onChange={(e) => updateFilter('sort', e.target.value as 'latest' | 'oldest')}
            options={SORT_OPTIONS}
          />
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filters
            </button>
          )}
          {totalCount !== undefined && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {totalCount} {totalCount === 1 ? 'lead' : 'leads'} found
            </span>
          )}
        </div>
        <Button variant="secondary" size="sm" onClick={onExport}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default FiltersBar;