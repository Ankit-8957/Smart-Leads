import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadFilters, PaginationMeta } from '../types';
import { leadService } from '../services/leadService';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

interface UseLeadsReturn {
  leads: Lead[];
  isLoading: boolean;
  meta: PaginationMeta | null;
  filters: LeadFilters;
  setFilters: React.Dispatch<React.SetStateAction<LeadFilters>>;
  refetch: () => void;
  deleteLead: (id: string) => Promise<void>;
  exportCSV: () => Promise<void>;
}

export const useLeads = (): UseLeadsReturn => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    sort: 'latest',
    search: '',
    status: '',
    source: '',
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await leadService.getLeads({
        ...filters,
        search: debouncedSearch,
      });
      setLeads(response.data || []);
      setMeta(response.meta || null);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const deleteLead = useCallback(async (id: string) => {
    await leadService.deleteLead(id);
    toast.success('Lead deleted');
    fetchLeads();
  }, [fetchLeads]);

  const exportCSV = useCallback(async () => {
    try {
      await leadService.exportCSV({
        status: filters.status || undefined,
        source: filters.source || undefined,
        search: filters.search,
      });
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    }
  }, [filters]);

  return {
    leads,
    isLoading,
    meta,
    filters,
    setFilters,
    refetch: fetchLeads,
    deleteLead,
    exportCSV,
  };
};