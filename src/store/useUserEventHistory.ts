// store/useUpcomingEventsStore.ts
import { create } from 'zustand';
import { UpcomingEvent, UpcomingEventsStore } from '@/types/store';
import axiosInstance from '@/shared/axiousintance';

export const useUserEventHistory = create<UpcomingEventsStore>((set, get) => ({
  upcomingEvents: [],
  totalCount:0,
  isLoading: false,
  error: null,

  fetchAllEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = get().getUserIdFromToken();
      if (userId) {
        const response = await axiosInstance.get(`/userEvent/eventHistory/${userId}`,{withCredentials: true});
        // Transform the response data to match our interface if needed
      console.log('dddd',response.data.totalCount,'erssfdsajf');
      
        
        const events: UpcomingEvent[] = response.data.events.map((event: any) => ({
          ...event,
          // Ensure dates are properly formatted as strings
          date: new Date(event.date).toISOString(),
          createdAt: new Date(event.createdAt).toISOString(),
          updatedAt: new Date(event.updatedAt).toISOString()
        }));
        set({ upcomingEvents: events,totalCount: response.data.totalCount, isLoading: false });
      } else {
        set({ error: 'Failed to fetch user ID from token', isLoading: false });
      }
    } catch (error) {
      set({ error: 'Failed to fetch upcoming events', isLoading: false });
      console.error('Error fetching upcoming events:', error);
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