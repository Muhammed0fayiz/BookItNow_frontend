import { create } from 'zustand';

import { UserStore, UserProfile } from '@/types/store';
import { fetchUserProfile } from '@/services/user';

const useUserStore = create<UserStore>((set) => ({
  userProfile: null,
  isLoading: false,
  error: null,

  fetchUserProfile: async () => {
    set({ isLoading: true });
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('userToken='));
      if (token) {
        const payload = token.split('=')[1].split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        const userId = decodedPayload.id;

        const userData = await fetchUserProfile(userId); 

        const formattedUserData: UserProfile = {
          id: userId,
          username: userData.username,
          email: userData.email,
          isVerified: userData.isVerified,
          isBlocked: userData.isBlocked,
          waitingPermission: userData.waitingPermission,
          isPerformerBlocked: userData.isPerformerBlocked,
          walletBalance: userData.walletBalance,
          profileImage: userData.profileImage || undefined,
        };

        set({ userProfile: formattedUserData, isLoading: false, error: null });
      }
    } catch (error) {
      set({ isLoading: false, error: 'Failed to fetch user profile.' });
    }
  },

  handleLogout: () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    window.location.href = '/';
  },
}));

export default useUserStore;
