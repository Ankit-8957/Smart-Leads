import apiClient from './apiClient';
import {
  ApiResponse,
  Lead,
  LeadFilters,
  CreateLeadPayload,
  UpdateLeadPayload,
} from '../types';

export const leadService = {
  getLeads: async (filters: LeadFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort) params.set('sort', filters.sort);
    if (filters.page) params.set('page', String(filters.page));

    const { data } = await apiClient.get<ApiResponse<Lead[]>>(
      `/leads?${params.toString()}`
    );
    return data;
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const { data } = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    if (!data.data) throw new Error('Lead not found');
    return data.data;
  },

  createLead: async (payload: CreateLeadPayload): Promise<Lead> => {
    const { data } = await apiClient.post<ApiResponse<Lead>>('/leads', payload);
    if (!data.data) throw new Error('Failed to create lead');
    return data.data;
  },

  updateLead: async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
    const { data } = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, payload);
    if (!data.data) throw new Error('Failed to update lead');
    return data.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },

  exportCSV: async (filters: Omit<LeadFilters, 'page' | 'sort'> = {}): Promise<void> => {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);

    const response = await apiClient.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};