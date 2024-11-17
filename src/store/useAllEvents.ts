import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';
import { Events } from '@/types/store';

// Store interface for fetching all events
interface EventsStore {
  events: Events[];
  isLoading: boolean;
  error: string | null;

  // Action to fetch all events
  fetchAllEvents: () => Promise<void>;
}

const useAllEventsStore = create<EventsStore>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  // Fetch all events
  fetchAllEvents: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await axiosInstance.get('/getAllEvents');

      if (response.status === 200) {
        set({
          events: response.data || [],
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },
}));

export default useAllEventsStore;
