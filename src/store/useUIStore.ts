// src/store/useUIStore.ts
import { create } from 'zustand';
import { UIState } from '@/types/store';

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  chatOpen: false,
  toggleSidebar: () => set((state: { sidebarOpen: any; }) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleChat: () => set((state: { chatOpen: any; }) => ({ chatOpen: !state.chatOpen }))
}));



