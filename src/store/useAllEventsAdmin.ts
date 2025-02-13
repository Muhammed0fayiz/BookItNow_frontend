import { create } from 'zustand';
import { Events } from '@/types/store';
import { fetchAllAdminEvents } from '@/services/admin';
interface EventsStore {
  events: Events[];
  isLoading: boolean;
  error: string | null;
  fetchAllEvents: () => Promise<void>;
}

const useAllEventsAdminStore = create<EventsStore>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchAllEvents: async () => {
    try {
      set({ isLoading: true, error: null });

      const events = await fetchAllAdminEvents();
      set({ events, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch events',
        isLoading: false,
      });
    }
  },
}));

export default useAllEventsAdminStore;
