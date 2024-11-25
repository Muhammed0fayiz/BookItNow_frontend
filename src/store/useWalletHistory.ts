import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';
import { WalletDocument } from '@/types/store';


interface WalletHistoryStore {
  walletHistory: WalletDocument[];
  isLoading: boolean;
  error: string | null;


  fetchWalletHistory: () => Promise<void>;
  getUserIdFromToken: () => string | null; 
}

const useWalletHistoryStore = create<WalletHistoryStore>((set) => ({
  walletHistory: [],
  isLoading: false,
  error: null,


  fetchWalletHistory: async () => {
    try {
      set({ isLoading: true, error: null });

      const userId = useWalletHistoryStore.getState().getUserIdFromToken();

      if (!userId) {
        set({
          error: 'Failed to retrieve user ID from token',
          isLoading: false,
        });
        return;
      }

      const response = await axiosInstance.get(`/getWalletHistory/${userId}`);

      if (response.status === 200) {
        set({
          walletHistory: response.data.data || [],
          isLoading: false,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      set({
        error: errorMessage,
        isLoading: false,
      });
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
        return decodedPayload.id || null;
      }
      return null;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  },
}));

export default useWalletHistoryStore;
