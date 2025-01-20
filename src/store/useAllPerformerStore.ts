import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';
import { Performer } from '@/types/store';

interface PerformersState {
  performers: Performer[];
  isLoading: boolean;
  error: string | null;
  fetchAllPerformers: (userId?: string) => Promise<void>;
  setPerformers: (performers: Performer[]) => void;
  getUserIdFromToken: () => string | null;
}

const usePerformersStore = create<PerformersState>((set) => ({
  performers: [],
  isLoading: false,
  error: null,

  fetchAllPerformers: async (userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const id = userId || usePerformersStore.getState().getUserIdFromToken();
      if (!id) {
        set({ error: 'Failed to retrieve user ID', isLoading: false });
        return;
      }
      const response = await axiosInstance.get<{ data: Performer[] }>(`/userevent/getperformers/${id}`,{withCredentials: true});
      set({ performers: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch performers', isLoading: false });
    }
  },

  setPerformers: (performers: Performer[]) => {
    set({ performers });
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

export default usePerformersStore;
