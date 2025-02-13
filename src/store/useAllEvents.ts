import { create } from 'zustand';
// import { fetchAllEvents } from '@/services/eventService';
import { Events } from '@/types/store';
import { fetchAllEvents } from '@/services/userEvent';

interface EventsStore {
  events: Events[];
  isLoading: boolean;
  error: string | null;
  fetchAllEvents: () => Promise<void>;
  getUserIdFromToken: () => string | null;
}

const useAllEventsStore = create<EventsStore>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchAllEvents: async () => {
    try {
      set({ isLoading: true, error: null });

      const userId = useAllEventsStore.getState().getUserIdFromToken();
      if (!userId) {
        set({ error: 'Failed to retrieve user ID from token', isLoading: false });
        return;
      }

      const events = await fetchAllEvents(userId);
      set({ events, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch events',
        isLoading: false,
      });
    }
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
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  },
}));

export default useAllEventsStore;
