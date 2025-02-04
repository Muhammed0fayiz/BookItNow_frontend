import { create } from 'zustand';
import { FavoritesStore, FavoriteEvent } from '@/types/store';
import axiosInstance from '@/shared/axiousintance';

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
  
      const response = await axiosInstance.get(`/userEvent/favorites/${userId}`, { withCredentials: true });
  
      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      const data = response.data.data;
      const totalCount = response.data.totalCount;  // Assuming the API returns totalCount
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: Expected an array.');
      }
  
      const favorites: FavoriteEvent[] = data.map((event: FavoriteEvent) => ({
        ...event,

        createdAt: event.createdAt ? new Date(event.createdAt).toISOString() : null,
        updatedAt: event.updatedAt ? new Date(event.updatedAt).toISOString() : null,
      }));
  
      set({ 
        favoriteEvents: favorites,
        totalCount,  // Update totalCount
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to fetch favorite events', isLoading: false });
      console.error('Error fetching favorite events:', error);
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
