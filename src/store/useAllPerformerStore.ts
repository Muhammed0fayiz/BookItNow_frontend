import { create } from 'zustand';
// import { fetchPerformers } from '@/services/performerService';
import { Performer } from '@/types/store';
import { fetchPerformers } from '@/services/userEvent';

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

      const performers = await fetchPerformers(id);
      set({ performers, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch performers',
        isLoading: false,
      });
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
