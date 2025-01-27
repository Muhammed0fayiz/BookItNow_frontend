import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';
import { Events } from '@/types/store';


interface Event {
  _id?: string;
  title: string;
  category: string;
  userId: string;
  price: number;
  status: string;
  teamLeader: string;
  teamLeaderNumber: string;
  rating: number;
  description: string;
  imageUrl: string;
}


interface PerformerEventsStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalEarnings: number;
  averageRating: number;
}


interface PerformerEventsStore {
  getUserIdFromToken(): unknown;
  events: Events[];
  stats: PerformerEventsStats;
  isLoading: boolean;
  error: string | null;

  // Action methods
  setEvents: (events: Events[]) => void; // Added this line
  fetchPerformerEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, '_id'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  removeEvent: (eventId: string) => Promise<void>;
  fetchPerformerEventStats: () => Promise<void>;
}

// Default stats to initialize the store
const defaultStats: PerformerEventsStats = {
  totalEvents: 0,
  upcomingEvents: 0,
  pastEvents: 0,
  totalEarnings: 0,
  averageRating: 0,
};

const usePerformerEventsStore = create<PerformerEventsStore>((set) => ({
  events: [],
  stats: defaultStats,
  isLoading: false,
  error: null,

  // Added setEvents method
  setEvents: (events) => {
    set({ events });
  },

  // Utility function to get user ID from token
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

  // Fetch performer events
  fetchPerformerEvents: async () => {
    try {
      set({ isLoading: true, error: null });

      const userId = usePerformerEventsStore.getState().getUserIdFromToken();
      if (!userId) {
        throw new Error('No user ID found');
      }

      const response = await axiosInstance.get(`/performerEvent/getPerformerEvents/${userId}`,{withCredentials: true});

      if(response.status === 200) {
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

  // Add a new event
  addEvent: async (event) => {
    try {
      set({ isLoading: true, error: null });

      const userId = usePerformerEventsStore.getState().getUserIdFromToken();
      if (!userId) {
        throw new Error('No user ID found');
      }

      const eventWithUserId = { ...event, userId };
      const response = await axiosInstance.post('/api/events', eventWithUserId,{withCredentials:true});

      set((state) => ({
        events: [...state.events, response.data],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  // Update an existing event
  updateEvent: async (event) => {
    try {
      set({ isLoading: true, error: null });

      const response = await axiosInstance.put(`/api/events/${event._id}`, event,{withCredentials:true});

      set((state) => ({
        events: state.events.map((e) =>
          e._id === event._id ? response.data : e
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  // Remove an event
  removeEvent: async (eventId) => {
    try {
      set({ isLoading: true, error: null });

      await axiosInstance.delete(`/performerEvent/deleteEvent/${eventId}`,{withCredentials:true});

      set((state) => ({
        events: state.events.filter((event) => event._id !== eventId),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  // Fetch performer event statistics
  fetchPerformerEventStats: async () => {
    try {
      set({ isLoading: true, error: null });

      const userId = usePerformerEventsStore.getState().getUserIdFromToken();
      if (!userId) {
        throw new Error('No user ID found');
      }

      const response = await axiosInstance.get(`/performerEvent/getPerformerEventStats/${userId}`,{withCredentials:true});

      set({
        stats: response.data?.stats || defaultStats,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },
}));

export default usePerformerEventsStore;