import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';
import { ChatRoom } from '@/types/store';

interface ChatState {
  chatRooms: ChatRoom[];
  isLoading: boolean;
  error: string | null;
  fetchAllChatRooms: (userId?: string) => Promise<void>;
  setChatRooms: (chatRooms: ChatRoom[]) => void;
  getUserIdFromToken: () => string | null;
}

const useChatRooms = create<ChatState>((set) => ({
  chatRooms: [],
  isLoading: false,
  error: null,

  fetchAllChatRooms: async (userId?: string) => {
    console.log('Fetching chat rooms...');
    set({ isLoading: true, error: null });

    try {
      const id = userId || useChatRooms.getState().getUserIdFromToken();
      if (!id) {
        set({ error: 'Failed to retrieve user ID', isLoading: false });
        return;
      }

      const response = await axiosInstance.get<{ data: ChatRoom[] }>(`/chatrooms/${id}`,{withCredentials:true});
      console.log('Fetched chat rooms:', response.data.data);
      set({ chatRooms: response.data.data, isLoading: false });
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch chat rooms',
        isLoading: false,
      });
    }
  },

  setChatRooms: (chatRooms: ChatRoom[]) => {
    set({ chatRooms });
    console.log('Chat rooms updated:', chatRooms);
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
      console.error('Error parsing token:', error);
      return null;
    }
  },
}));

export default useChatRooms;
