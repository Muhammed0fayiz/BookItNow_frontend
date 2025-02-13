import { create } from 'zustand';
import { WalletDocument } from '@/types/store';
import { fetchWalletHistory } from '@/services/user';


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
        set({ error: 'Failed to retrieve user ID from token', isLoading: false });
        return;
      }

      const walletHistory = await fetchWalletHistory(userId);
      set({ walletHistory, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch wallet history', isLoading: false });
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
