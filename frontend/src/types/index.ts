export type UserRole = 'admin' | 'sales';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type SortOrder = 'latest' | 'oldest';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: string[];
}

export interface LeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: SortOrder;
  page?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
}

export interface UpdateLeadPayload extends Partial<CreateLeadPayload> { }