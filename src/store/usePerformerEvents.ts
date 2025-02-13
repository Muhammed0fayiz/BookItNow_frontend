import { fetchPerformerEvents } from "@/services/performerEvent";
import { create } from "zustand";

import { Events } from "@/types/store";

interface PerformerEventsStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalEarnings: number;
  averageRating: number;
}

interface PerformerEventsStore {
  getUserIdFromToken(): string | null;
  events: Events[];
  stats: PerformerEventsStats;
  isLoading: boolean;
  error: string | null;

  // Action methods
  setEvents: (events: Events[]) => void;
  fetchPerformerEvents: () => Promise<void>;
}

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

  setEvents: (events) => {
    set({ events });
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
      if (token) {
        const payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload.id;
      }
      return null;
    } catch (error) {
      console.error("Error extracting user ID from token:", error);
      return null;
    }
  },

  fetchPerformerEvents: async () => {
    try {
      set({ isLoading: true, error: null });

      const userId = usePerformerEventsStore.getState().getUserIdFromToken();
      if (!userId) {
        throw new Error("No user ID found");
      }

      const events = await fetchPerformerEvents(userId);

      set({
        events: events || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch events",
        isLoading: false,
      });
    }
  },
}));

export default usePerformerEventsStore;
