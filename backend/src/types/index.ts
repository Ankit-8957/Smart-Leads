import { Request } from 'express';
import { Document, Types } from 'mongoose';

export type UserRole = 'admin' | 'sales';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  notes?: string;
  assignedTo?: Types.ObjectId;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {}

export interface LeadFilters {
  search?: string;
  status?: string;
  source?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
