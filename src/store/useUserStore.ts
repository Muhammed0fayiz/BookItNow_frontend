import { create } from 'zustand';
import axiosInstance from '@/shared/axiousintance';
import { UserStore, UserProfile } from '@/types/store';

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

        const response = await axiosInstance.get(`/getUser/${userId}`,{withCredentials: true});
        if (response.data.response) {
          const userData: UserProfile = {
            
            id:userId,
            username: response.data.response.username,
            email: response.data.response.email,
            isVerified: response.data.response.isVerified,
            isBlocked: response.data.response.isBlocked,
            waitingPermission:response.data.response.waitingPermission,
            isPerformerBlocked: response.data.response.isPerformerBlocked,
            walletBalance: response.data.response.walletBalance,
            profileImage: response.data.response.profileImage || undefined,
          };

          set({ userProfile: userData, isLoading: false, error: null });
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      set({ isLoading: false, error: 'Failed to fetch user profile.' });
    }
  },

  updateUserProfile: async (profile: Partial<UserProfile>) => {
    set({ isLoading: true });
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('userToken='));
      if (token) {
        const payload = token.split('=')[1];
        const response = await axiosInstance.put('/updateUserProfile', { ...profile, token: payload },{withCredentials:true});
        if (response.data.success) {
          // Optionally fetch the updated profile
          await useUserStore.getState().fetchUserProfile();
        }
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
      set({ isLoading: false, error: 'Failed to update user profile.' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleUserVerification: async (userId: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(`/toggleVerification/${userId}`,{withCredentials:true});
      if (response.data.success) {
        await useUserStore.getState().fetchUserProfile(); // Fetch updated profile after verification change
      }
    } catch (error) {
      console.error('Failed to toggle user verification:', error);
      set({ error: 'Failed to toggle user verification.' });
    } finally {
      set({ isLoading: false });
    }
  },

  handleLogout: () => {
    document.cookie = 'userToken=; Max-Age=0; path=/;';
    window.location.href = '/auth';
  },
}));

export default useUserStore;
