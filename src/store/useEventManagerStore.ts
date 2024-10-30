import { create } from 'zustand';
import axios from 'axios';

interface Event {
  id: number;
  title: string;
  category: string;
  price: number;
  status: string;
  teamLeader: string;
  teamLeaderNumber: string;
  rating: number;
  description: string;
  imageUrl: string;
}

interface EventManagerState {
  events: Event[];
  eventManagerDetails: {
    name: string;
    imageUrl: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  addEvent: (event: Event) => Promise<void>;
  removeEvent: (eventId: number) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  fetchEventManagerDetails: () => Promise<void>;
}

const useEventManagerStore = create<EventManagerState>((set, get) => ({
  events: [],
  eventManagerDetails: null,
  isLoading: false,
  error: null,
  fetchEvents: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get('/api/events');
      set({ events: response.data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  addEvent: async (event) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post('/api/events', event);
      set((state) => ({ events: [...state.events, response.data] }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  removeEvent: async (eventId) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`/api/events/${eventId}`);
      set((state) => ({ events: state.events.filter((event) => event.id !== eventId) }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  updateEvent: async (event) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.put(`/api/events/${event.id}`, event);
      set((state) => ({ events: state.events.map((e) => (e.id === event.id ? response.data : e)) }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchEventManagerDetails: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get('/api/event-manager');
      set({ eventManagerDetails: response.data });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useEventManagerStore;