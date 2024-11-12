// store.ts
import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';
import { Performer } from '@/types/store';

interface PerformersState {
  performers: Performer[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAllPerformers: () => Promise<void>;
  setPerformers: (performers: Performer[]) => void; // New action to set performers directly
}

const usePerformersStore = create<PerformersState>((set) => ({
  performers: [],
  isLoading: false,
  error: null,

  fetchAllPerformers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<{ data: Performer[] }>('/user/getperformers');
      console.log('response', response.data.data);
      set({
        performers: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch performers',
        isLoading: false,
      });
    }
  },

  // Implementing setPerformers action
  setPerformers: (performers: Performer[]) => {
    set({ performers });
  },
}));

export default usePerformersStore;
