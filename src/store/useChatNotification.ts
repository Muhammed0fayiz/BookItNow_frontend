import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';

interface ChatNotification {
  userId: string;
  numberOfMessages: number;
}

interface ChatNotificationsState {
   totalUnreadMessage: number;
  notifications: ChatNotification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (userId?: string) => Promise<void>;
  getUserIdFromToken: () => string | null;
}

const useChatNotifications = create<ChatNotificationsState>((set) => ({
   totalUnreadMessage: 0,
  notifications: [],
  isLoading: false,
  error: null,

  // Fetch chat notifications
  fetchNotifications: async (userId?: string) => {
    console.log('Fetching chat notifications...');
    set({ isLoading: true, error: null });

    try {
      const id = userId || useChatNotifications.getState().getUserIdFromToken();
      if (!id) {
        set({ error: 'Failed to retrieve user ID from token', isLoading: false });
        return;
      }

      const response = await axiosInstance.get<{
          data: { totalCount: any; notifications: any; }; totalCount: number; notifications: ChatNotification[] 
}>(
        `/messageNotification/${id}`,
        { withCredentials: true }
      );

   

  
      const { totalCount, notifications } = response.data.data;

      set({
        totalUnreadMessage: totalCount || 0,
        notifications: notifications || [],
        isLoading: false,
      });
      console.log('Fetched notifications:', notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        isLoading: false,
      });
    }
  },

  // Get user ID from the token
  getUserIdFromToken: () => {
    try {
      const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length > 1) {
          return parts[1].split(';')[0];
        }
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

export default useChatNotifications;