// store/useUpcomingEventsStore.ts
import { create } from 'zustand';
import { UpcomingEvent, UpcomingEventsStore } from '@/types/store';
import axiosInstance from '@/shared/axiousintance';

export const useFavouriteStore = create<UpcomingEventsStore>((set, get) => ({
  upcomingEvents: [],
  isLoading: false,
  error: null,

  fetchAllEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = get().getUserIdFromToken();
      if (!userId) {
        set({
          error: 'Unable to retrieve user ID. Please log in again.',
          isLoading: false,
        });
        return;
      }

      const response = await axiosInstance.get(`/favorites/${userId}`,{withCredentials: true});
      console.log('response', response);

      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      const data = response.data.data;
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: Expected an array.');
      }

 

      const events: UpcomingEvent[] = data.map((event: any) => ({
        ...event,
        date: event.date ? new Date(event.date).toISOString() : null,
        createdAt: event.createdAt ? new Date(event.createdAt).toISOString() : null,
        updatedAt: event.updatedAt ? new Date(event.updatedAt).toISOString() : null,
      }));


      set({
        upcomingEvents: events,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch upcoming events';
      set({
        error: errorMessage,
        isLoading: false,
        upcomingEvents: [],
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
      if (!token) throw new Error('Token not found');

      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      if (!decodedPayload.id) throw new Error('User ID not found in token payload');

      return decodedPayload.id;
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
