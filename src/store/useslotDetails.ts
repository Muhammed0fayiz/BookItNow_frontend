import { create } from 'zustand';
import { SlotStore, SlotMangement } from '@/types/store';
import { getSlotDetails } from '@/services/performer';

export const useSlotStore = create<SlotStore>((set, get) => ({
  slots: null,
  isLoading: false,
  error: null,

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

  fetchSlotDetails: async () => {
    set({ isLoading: true, error: null });

    try {
      const userId = get().getUserIdFromToken();
      if (!userId) throw new Error('No user ID found');

      const data = await getSlotDetails(userId); // Call the service function

      const slotDetails: SlotMangement = {
        bookingDates: Array.isArray(data.bookingDates)
          ? data.bookingDates.map((date: string) => new Date(date))
          : [],
        unavailableDates: Array.isArray(data.unavailableDates)
          ? data.unavailableDates.map((date: string) => new Date(date))
          : [],
      };

      set({ slots: slotDetails, isLoading: false });

      return slotDetails;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch slot details';
      set({ error: errorMessage, isLoading: false, slots: null });
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
