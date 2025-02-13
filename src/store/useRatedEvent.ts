import { create } from 'zustand';
import { Events } from '@/types/store';
import { fetchTopRatedEvents } from '@/services/userEvent';

interface EventsStore {
  topEvents: Events[];
  isLoading: boolean;
  error: string | null;
  fetchTopEvents: () => Promise<void>;
  getUserIdFromToken: () => string | null;
}

const topRatedEvent = create<EventsStore>((set, get) => ({
  topEvents: [],
  isLoading: false,
  error: null,

  fetchTopEvents: async () => {
    try {
      set({ isLoading: true, error: null });
  
      const userId = get().getUserIdFromToken();
  
      if (!userId) {
        set({ error: 'Failed to retrieve user ID from token', isLoading: false });
        return;
      }
  
      const events = await fetchTopRatedEvents(userId);
      set({ topEvents: events, isLoading: false });
  
    } catch (error) {
     
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
  
      set({ error: errorMessage, isLoading: false });
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

export default topRatedEvent;
