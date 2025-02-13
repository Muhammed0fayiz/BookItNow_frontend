import { create } from 'zustand';
import {  UpcomingEventsStore } from '@/types/store';
import { fetchUpcomingEvents } from '@/services/userEvent';


export const useUpcomingEventsStore = create<UpcomingEventsStore>((set, get) => ({
  upcomingEvents: [],
  totalCount: 0,
  isLoading: false,
  error: null,

  fetchAllEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = get().getUserIdFromToken();
      if (userId) {
        const { events, totalCount } = await fetchUpcomingEvents(userId);

        set({ upcomingEvents: events, totalCount, isLoading: false });
      } else {
        set({ error: 'Failed to fetch user ID from token', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch upcoming events', isLoading: false });
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
        return decodedPayload.id;
      }
      return null;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  },

  removeUpcomingEvent: (eventId: string) => {
    set((state) => ({
      upcomingEvents: state.upcomingEvents.filter((event) => event._id !== eventId),
    }));
  },
}));
