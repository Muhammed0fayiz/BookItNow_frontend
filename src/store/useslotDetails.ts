// store/useSlotStore.ts
import { create } from 'zustand';
import { SlotStore, SlotMangement } from '@/types/store';
import axiosInstance from '@/shared/axiousintance';

export const useSlotStore = create<SlotStore>((set, get) => ({
  slots: null,
  isLoading: false,
  error: null,

  // Method to get user ID from cookie
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

  fetchSlotDetails: async (performerId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // If no performerId is provided, try to get it from the token
      const userId = get().getUserIdFromToken();

      if (!userId) {
        throw new Error('No user ID found');
      }

      const response = await axiosInstance.get(`/performer/getslot/${userId}`);
      console.log('Response:', response);

      const data = response.data?.data || {}; // Safely access `data`

      // Transform the response data to match our interface
      const slotDetails: SlotMangement = {
        bookingDates: Array.isArray(data.bookingDates)
          ? data.bookingDates.map((date: string) => new Date(date))
          : [],
        unavailableDates: Array.isArray(data.unavailableDates)
          ? data.unavailableDates.map((date: string) => new Date(date))
          : []
      };

      set({ 
        slots: slotDetails, 
        isLoading: false 
      });

      return slotDetails;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch slot details';
      set({ 
        error: errorMessage, 
        isLoading: false,
        slots: null
      });
      console.error('Error fetching slot details:', error);
      throw error;
    }
  },

  clearSlotError: () => {
    set({ error: null });
  },

  clearSlotDetails: () => {
    set({ slots: null, error: null });
  }
}));
