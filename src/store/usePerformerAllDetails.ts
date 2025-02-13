import { fetchPerformerDetails } from "@/services/performer";
import { create } from "zustand";

interface PerformerAllDetails {
  walletAmount: number | null;
  walletTransactionHistory: Record<string, number>;
  totalEvent: number | null;
  totalPrograms: number | null;
  totalEventsHistory: Record<string, number>;
  upcomingEvents: Record<string, number>;
  totalReviews: number;
}

interface PerformerAllAdminStore {
  performerAllDetails: PerformerAllDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchPerformerAllDetails: (userId: string) => Promise<void>;
  getUserIdFromToken: () => string | null;
}

const usePerformerAllDetails = create<PerformerAllAdminStore>((set) => ({
  performerAllDetails: null,
  isLoading: false,
  error: null,

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
        return decodedPayload.id || null;
      }
      return null;
    } catch (error) {
      console.error("Error extracting user ID from token:", error);
      return null;
    }
  },

  fetchPerformerAllDetails: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const performerDetails = await fetchPerformerDetails(userId);
      set({ performerAllDetails: performerDetails, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Unknown error",
        isLoading: false,
      });
    }
  },
}));

export default usePerformerAllDetails;
