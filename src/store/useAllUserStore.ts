import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';
import {  User } from '@/types/store';

interface UserState {
  users:  User[];
  isLoading: boolean;
  error: string | null;
  fetchAllUsers: (userId?: string) => Promise<void>;
  setUsers: (users:  User[]) => void;
  getUserIdFromToken: () => string | null;
}

const useusersStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchAllUsers: async (userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const id = userId || useusersStore.getState().getUserIdFromToken();
      if (!id) {
        set({ error: 'Failed to retrieve user ID', isLoading: false });
        return;
      }
      const response = await axiosInstance.get<{ data: User[] }>(`/performer/getusers/${id}`,{withCredentials:true});
      set({ users: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch users', isLoading: false });
    }
  },

  setUsers: (users: User[]) => {
    set({ users });
  },

  getUserIdFromToken: () => {
    try {
      const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length > 1) return parts[1].split(';')[0];
        return undefined;
      };
      const token = getCookie('userToken');
      if (token) {
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload.id || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  },
}));

export default useusersStore;
