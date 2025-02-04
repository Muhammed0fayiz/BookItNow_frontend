import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';

export interface PerformerEventHistory {
  _id: string;
  imageUrl?: string;
  title: string;
  date: string;
  time: string;
  place: string;
  category: string;
  bookingStatus: string;
  price: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PerformerEventHistoryStore {
  performerEvents: PerformerEventHistory[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  fetchAllEvents: () => Promise<void>;
  getUserIdFromToken: () => string | null;
  removeEvent: (eventId: string) => void;
}

export const useEventHistory = create<PerformerEventHistoryStore>((set, get) => ({
  performerEvents: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  
  fetchAllEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = get().getUserIdFromToken();
      if (userId) {
        const response = await axiosInstance.get(`/performerEvent/eventhistory/${userId}`, {
          withCredentials: true
        });
        
        const events: PerformerEventHistory[] = response.data.events.map((event: PerformerEventHistory) => ({
          ...event,
          date: new Date(event.date).toISOString(),
          createdAt: new Date(event.createdAt).toISOString(),
          updatedAt: new Date(event.updatedAt).toISOString(),
        }));
        
        set({ 
          performerEvents: events,
          totalCount: response.data.totalCount, 
          isLoading: false 
        });
      } else {
        set({ error: 'Unable to fetch user ID from token', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch events', isLoading: false });
      console.error('Error fetching events:', error);
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
        return decodedPayload.id as string;
      }
      return null;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  },

  removeEvent: (eventId: string) => {
    set((state) => ({
      performerEvents: state.performerEvents.filter((event) => event._id !== eventId),
    }));
  },
}));