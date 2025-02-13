import { create } from 'zustand';
import { FavoritesStore } from '@/types/store';
import { fetchFavoriteEvents } from '@/services/userEvent';
export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favoriteEvents: [],
  totalCount: 0,
  favorites: [],
  isLoading: false,
  error: null,

  fetchfavoriteEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const userId = get().getUserIdFromToken();
      if (!userId) {
        set({ error: 'Failed to fetch user ID from token', isLoading: false });
        return;
      }

      const { favorites, totalCount } = await fetchFavoriteEvents(userId);

      set({
        favoriteEvents: favorites,
        totalCount, // Update totalCount
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch favorite events', isLoading: false });
    }
  },

  removeFavorite: (eventId: string) => {
    set((state) => ({
      favorites: state.favorites.filter((event) => event._id !== eventId),
    }));
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
}));
