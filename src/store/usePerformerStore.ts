import { create } from 'zustand';

import { PerformerStore, PerformerDetails, PerformerStats } from '@/types/store';
import { getPerformerDetails } from '@/services/performer';

const defaultStats: PerformerStats = {
  upcomingEvents: 0,
  pastEvents: 0,
  walletBalance: 0,
  totalReviews: 0
};

const usePerformerStore = create<PerformerStore>((set) => ({
  performerDetails: null,
  stats: defaultStats,
  sidebarOpen: false,

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

        const performerData = await getPerformerDetails(userId);
        if (performerData) {
          const performerDetails: PerformerDetails = {
            PId: userId,
            userId: performerData.userId,
            bandName: performerData.bandName,
            place: performerData.place,
            rating: performerData.rating,
            description: performerData.description,
            image: performerData.profileImage,
            genre: performerData.genre || 'Not specified',
            totalReviews: performerData.totalReviews,
            walletBalance: performerData.walletBalance,
            imageUrl: undefined,
            mobileNumber: performerData.mobileNumber
          };

          const stats: PerformerStats = {
            upcomingEvents: performerData.upcomingEvents || 0,
            pastEvents: performerData.pastEvents || 0,
            walletBalance: performerData.walletBalance || 0,
            totalReviews: performerData.totalReviews || 0
          };

          set({ performerDetails, stats });
        }
      }
    } catch (error) {
      console.error('Failed to fetch performer details:', error);
    }
  },

  handleLogout: () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    window.location.href = '/';
  },
}));

export default usePerformerStore;
