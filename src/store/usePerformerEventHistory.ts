import { fetchPerformerEventHistory } from "@/services/performerEvent";
import { create } from "zustand";

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
  status: "Confirmed" | "Pending" | "Cancelled";
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
      if (!userId) {
        throw new Error("Unable to fetch user ID from token");
      }

      const { events, totalCount } = await fetchPerformerEventHistory(userId);

      set({ performerEvents: events, totalCount, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Unknown error", isLoading: false });
    }
  },

  getUserIdFromToken: () => {
    try {
      const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length > 1) return parts[1].split(";")[0];
        return undefined;
      };

      const token = getCookie("userToken");
      if (!token) return null;

      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));

      return decodedPayload.id || null;
    } catch (error) {
      console.error("Error extracting user ID from token:", error);
      return null;
    }
  },

  removeEvent: (eventId: string) => {
    set((state) => ({
      performerEvents: state.performerEvents.filter((event) => event._id !== eventId),
      totalCount: state.totalCount > 0 ? state.totalCount - 1 : 0
    }));
  }
}));
