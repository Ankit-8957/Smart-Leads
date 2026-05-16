import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'admin' | 'sales') => Promise<void>;
  logout: () => void;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Re-hydrate user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    authService
      .getMe()
      .then((user) => {
        dispatch({ type: 'SET_USER', payload: { user, token } });
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authService.login({ email, password });
    localStorage.setItem('token', token);
    dispatch({ type: 'SET_USER', payload: { user, token } });
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role?: 'admin' | 'sales') => {
      const { user, token } = await authService.register({ name, email, password, role });
      localStorage.setItem('token', token);
      dispatch({ type: 'SET_USER', payload: { user, token } });
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};