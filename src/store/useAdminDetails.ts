import { fetchAdminDetailsApi } from "@/services/admin";
import { create } from "zustand";


interface AdminDetails {
  walletAmount: number | null;
  walletTransactionHistory: Record<string, number>;
  totalUsers: number | null;
  userRegistrationHistory: Record<string, number>;
  totalPerformers: number | null;
  performerRegistrationHistory: Record<string, number>;
}

interface AdminStore {
  adminDetails: AdminDetails | null;
  isLoading: boolean;
  error: string | null;
  fetchAdminDetails: () => Promise<void>;
}

const useAdminStore = create<AdminStore>((set) => ({
  adminDetails: null,
  isLoading: false,
  error: null,
  fetchAdminDetails: async () => {
    set({ isLoading: true, error: null });
    try {
      const adminDetails = await fetchAdminDetailsApi();
      set({ adminDetails, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false,
      });
    }
  },
}));

export default useAdminStore;
