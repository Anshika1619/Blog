import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  // Set user after checking token/login
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  
  // Clear user on logout
  logoutUser: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout error', error);
    }
  },

  // Check auth status on load
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/auth/me');
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));

export default useAuthStore;
