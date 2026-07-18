import { create } from 'zustand';
import { apiFetch } from '../services/api';

export interface User {
  id: number;
  username: string;
  email: string;
  streak: number;
  hearts: number;
  xp: number;
  crowns: number;
  created_at: string;
  last_active_at: string;
  current_course_id: number | null;
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  activeTab: string;
  
  setActiveTab: (tab: string) => void;
  initUser: () => Promise<void>;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateHearts: (amount: number, changeType: string) => Promise<void>;
  updateXP: (amount: number, source: string) => Promise<void>;
  selectCourse: (courseId: number) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('duolingo_token') : null,
  loading: false,
  error: null,
  activeTab: 'learn',

  setActiveTab: (tab) => set({ activeTab: tab }),

  initUser: async () => {
    const token = get().token;
    if (!token) return;
    
    set({ loading: true });
    try {
      const user = await apiFetch<User>('/api/auth/me');
      set({ user, loading: false, error: null });
    } catch (err: any) {
      set({ user: null, token: null, loading: false });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('duolingo_token');
      }
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await apiFetch<{ access_token: string; token_type: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('duolingo_token', res.access_token);
      }
      set({ token: res.access_token });
      
      // Fetch user profile
      const user = await apiFetch<User>('/api/auth/me');
      set({ user, loading: false, error: null });
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Login failed' });
      throw err;
    }
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      // Auto login
      await get().login({ username: data.username, password: data.password });
    } catch (err: any) {
      set({ loading: false, error: err.message || 'Registration failed' });
      throw err;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('duolingo_token');
    }
    set({ user: null, token: null, error: null });
  },

  fetchProfile: async () => {
    try {
      const user = await apiFetch<User>('/api/auth/me');
      set({ user });
    } catch (err: any) {
      // ignore or log
    }
  },

  updateHearts: async (amount, changeType) => {
    try {
      const user = await apiFetch<User>('/api/users/update-hearts', {
        method: 'POST',
        body: JSON.stringify({ amount, change_type: changeType }),
      });
      set({ user });
    } catch (err: any) {
      // ignore
    }
  },

  updateXP: async (amount, source) => {
    try {
      const user = await apiFetch<User>('/api/users/update-xp', {
        method: 'POST',
        body: JSON.stringify({ amount, source }),
      });
      set({ user });
    } catch (err: any) {
      // ignore
    }
  },

  selectCourse: async (courseId) => {
    try {
      const user = await apiFetch<User>(`/api/courses/select/${courseId}`, {
        method: 'POST',
      });
      set({ user });
    } catch (err: any) {
      // ignore
    }
  },

  clearError: () => set({ error: null }),
}));
