import { create } from 'zustand';
import { PerformerUpcomingEventsStore } from '@/types/store';
import { fetchUpcomingEvents } from '@/services/performerEvent';

export const useUpcomingEventsStore = create<PerformerUpcomingEventsStore>((set, get) => ({
  performerupcomingEvents: [],
  totalCount: 0,
  isLoading: false,
  error: null,


  fetchAllEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = get().getUserIdFromToken();
      if (userId) {
        const { events, totalCount } = await fetchUpcomingEvents(userId);
        set({ performerupcomingEvents: events, totalCount, isLoading: false });
      } else {
        set({ error: 'Unable to fetch user ID from token', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch upcoming events', isLoading: false });
    }
  },

  // Extract user ID from the token stored in cookies
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
        return decodedPayload.id as string;
      }
      return null;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  },

  // Remove an event by its ID
  removeUpcomingEvent: (eventId: string) => {
    set((state) => ({
      performerupcomingEvents: state.performerupcomingEvents.filter((event) => event._id !== eventId),
    }));
  },
}));
