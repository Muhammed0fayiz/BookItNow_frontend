import { create } from "zustand";

import axiosInstance from "@/shared/axiousintance";


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
      const response = await axiosInstance.get("http://localhost:5000/admin/details");
      if (response.data.success) {
        set({ adminDetails: response.data.data, isLoading: false });
      } else {
        set({ error: "Failed to fetch admin details", isLoading: false });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
      });
    }
  },
}));

export default useAdminStore;
