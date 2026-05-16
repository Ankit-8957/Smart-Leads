import apiClient from './apiClient';
import { ApiResponse, User } from '../types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'sales';
}

interface AuthData {
  user: User;
  token: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthData> => {
    const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/login', payload);
    if (!data.data) throw new Error('No data returned');
    return data.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthData> => {
    const { data } = await apiClient.post<ApiResponse<AuthData>>('/auth/register', payload);
    if (!data.data) throw new Error('No data returned');
    return data.data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
    if (!data.data) throw new Error('No data returned');
    return data.data;
  },
};