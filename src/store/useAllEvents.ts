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
  getUserIdFromToken: () => string | null; // Utility to get user ID
}

const useAllEventsStore = create<EventsStore>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  // Fetch all events using the ID from the token
  fetchAllEvents: async () => {
    try {
      set({ isLoading: true, error: null });

      const userId = useAllEventsStore.getState().getUserIdFromToken();

      if (!userId) {
        set({
          error: 'Failed to retrieve user ID from token',
          isLoading: false,
        });
        return;
      }

      const response = await axiosInstance.get(`/userEvent/getAllEvents/${userId}`,{withCredentials: true});
console.log('res',response);

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

  // Utility function to get user ID from token in cookie
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
