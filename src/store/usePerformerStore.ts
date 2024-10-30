import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';
import { PerformerStore, PerformerDetails, PerformerStats, ChatMessage } from '@/types/store';

const defaultStats: PerformerStats = {
  upcomingEvents: 0,
  pastEvents: 0,
  walletBalance: 0,
  totalReviews: 0
};

const usePerformerStore = create<PerformerStore>((set) => ({
  performerDetails: null,
  stats: defaultStats,
  messages: [],
  sidebarOpen: false,
  chatOpen: false,
  newMessage: '',

  fetchPerformerDetails: async () => {
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
        const userId = decodedPayload.id;

        const response = await axiosInstance.get(`/getPerformer/${userId}`);
        if (response.data.response) {
          const performerData: PerformerDetails = {
            PId:userId,
            userId: response.data.response.userId,
            bandName: response.data.response.bandName,
            place: response.data.response.place,
            rating: response.data.response.rating,
            description: response.data.response.description,
            image: response.data.response.profileImage,
            genre: response.data.response.genre || 'Not specified',
            totalReviews: response.data.response.totalReviews,
            walletBalance: response.data.response.walletBalance,
            imageUrl: undefined,
            mobileNumber:response.data.response.mobileNumber
          };

          const stats: PerformerStats = {
            upcomingEvents: response.data.response.upcomingEvents || 0,
            pastEvents: response.data.response.pastEvents || 0,
            walletBalance: response.data.response.walletBalance || 0,
            totalReviews: response.data.response.totalReviews || 0
          };

          set({ performerDetails: performerData, stats });
        }
      }
    } catch (error) {
      console.error('Failed to fetch performer details:', error);
    }
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),

  sendMessage: (message: string) => {
    if (message.trim()) {
      set((state) => {
        const newMessage: ChatMessage = {
          id: Date.now(),
          text: message,
          sender: 'performer',
          timestamp: new Date()  // Added timestamp field
        };
        
        return {
          messages: [...state.messages, newMessage],
          newMessage: ''
        };
      });
    }
  },

  handleLogout: () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    window.location.href = '/auth';
  },
}));

export default usePerformerStore;