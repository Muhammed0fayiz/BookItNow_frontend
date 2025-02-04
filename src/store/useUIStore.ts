// src/store/useUIStore.ts
import { create } from 'zustand';
import { UIState } from '@/types/store';

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  chatOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen }))
}));


